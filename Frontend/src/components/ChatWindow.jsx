import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatWindow.css";

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
      setIsTyping(false);
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

  useEffect(() => {
    if (!text) return setIsTyping(false);
    setIsTyping(true);
    const timeout = setTimeout(() => setIsTyping(false), 2000);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        💬 Chat with <span>{selectedUser?.name}</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => {
          const isReceived = msg.sender._id === selectedUser._id;
          return (
            <div key={msg._id} className={`chat-row ${isReceived ? "left" : "right"}`}>
              {isReceived && (
                <img
                  src={msg.sender.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="avatar"
                />
              )}
              <div className={`chat-bubble ${isReceived ? "received" : "sent"}`}>
                <p>{msg.text}</p>
                <span className="timestamp">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        {isTyping && <div className="typing-indicator">Typing...</div>}
        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input-bar">
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
