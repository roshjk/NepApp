import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatWindow.css";

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/message/conversation/${selectedUser._id}`,
        { withCredentials: true }
      );
      setMessages(data.messages);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/message/send",
        { receiver: selectedUser._id, text },
        { withCredentials: true }
      );

      setMessages((prev) => [...prev, data.message]);
      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  useEffect(() => {
    if (selectedUser) fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>💬 Chat with <span>{selectedUser?.name}</span></h2>
      </div>

      <div className="chat-body">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat-bubble ${
              msg.sender._id === selectedUser._id ? "received" : "sent"
            }`}
          >
            <p>{msg.text}</p>
            <span className="timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
