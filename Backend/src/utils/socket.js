const socket = require("socket.io");
const crypto = require("crypto");
const {Chat} = require("../models/chat");

//roomid hashing function for security 
const getSecretRoomId = (userId, targetUserId)=>{
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex")
}

const initializeSocket = (server)=>{
    const io = socket(server,{
        cors: {
            origin: "http://localhost:5173",
        }
    })
    //receive the connections
    io.on("connection", (socket)=>{
        //handle events or listening the connections
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId)
            console.log(firstName + " User joined room: " + roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage", async ({
          text,
          firstName,
          lastName,
          userId,
          targetUserId,
        })=>{
            
            //to write a logic to store the chat in db if exixts or create a new chat and store the message
            try{
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(
              "Message from " + firstName + " in room: " + roomId + " : " + text
            );

            let chat = await Chat.findOne({
                participants: {$all: [userId, targetUserId]}
            })

            if(!chat){
                chat = new Chat({
                    participants: [userId, targetUserId],
                    messages: []
                })
            }

            chat.messages.push({senderId: userId, text})
            await chat.save();
            io.to(roomId).emit("messageReceived", { text, firstName, lastName });

        }catch(err){
            console.log(err);
        }


            
        })
        socket.on("disconnect", ()=>{

        })

    })
}

module.exports = initializeSocket;