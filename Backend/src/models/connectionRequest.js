const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    status: {
        type: String,
        required: true,
        enum: {
           values: ["accepted","rejected", "interested", "ignored"],
           message: `{VALUES}, is incorrect status `,
        }
    }
}, {timestamps: true})
// connectionRequest to find fromUserId : 68ab058c872777f99010a2ff, toUserId: 68aae0f1fa9586d1740f59ae, if consufed ses EP12 S2 timing 1.35min
connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre("save", function (){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself")
    }
})

const connectionRequestModal = new mongoose.model(
    "connectionRequestModel",connectionRequestSchema
)

module.exports = connectionRequestModal