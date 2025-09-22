import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { formatDistanceToNow } from "date-fns";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const socketRef = useRef(null);
  const chatScrollRef = useRef(null); // container ref
  const chatEndRef = useRef(null); // bottom anchor

  const scrollToBottom = (behavior = "smooth") => {
    // scroll only the chat container
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior,
      });
    } else {
      chatEndRef.current?.scrollIntoView({ behavior });
    }
  };

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text, createdAt } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
        createdAt: createdAt || new Date(),
      };
    });
    setMessages(chatMessages);
    // scroll once after initial load (instant)
    setTimeout(() => scrollToBottom("auto"), 50);
  };

  useEffect(() => {
    fetchChatMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    // Only scroll when an incoming message arrives from the other user.
    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prevMessages) => {
        const next = [
          ...prevMessages,
          { firstName, lastName, text, createdAt: new Date() },
        ];
        // allow state to update then scroll the chat container
        setTimeout(() => scrollToBottom(), 50);
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user.firstName]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current?.emit("sendMessage", {
      text: newMessage,
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
    });

    // Do NOT scroll here. Server will broadcast back via "messageReceived"
    // and the socket handler will append and scroll the chat container.
    setNewMessage("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 h-[75vh] flex flex-col bg-gradient-to-br from-[#0b0410] to-[#1a1a2e] rounded-xl shadow-lg border border-white/10">
      <h1 className="text-white text-xl font-semibold p-5 border-b border-white/10">
        Lets Chat
      </h1>

      {/* chat messages container: fixed height + scroll only here */}
      <div
        ref={chatScrollRef}
        className="flex-1 px-6 py-4 space-y-4 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.map((msg, index) => {
          const isCurrentUser = msg.firstName === user.firstName;
          return (
            <div
              key={index}
              className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header text-white/70 text-sm mb-1">
                {isCurrentUser ? "You" : `${msg.firstName} ${msg.lastName}`}
                <time className="ml-2 text-xs text-white/50">
                  {formatDistanceToNow(new Date(msg.createdAt), {
                    addSuffix: true,
                  })}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  isCurrentUser
                    ? "bg-fuchsia-700 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {msg.text}
              </div>
              <div className="chat-footer text-xs text-white/50 mt-1">✔️✔️</div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="p-5 border-t border-white/10 flex items-center gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="btn bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-4 py-2 rounded-lg transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
