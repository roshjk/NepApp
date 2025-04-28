import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "./ChatWindow";
import { useSearchParams } from "react-router-dom";
import "./Messaging.css";

const Messaging = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchParams] = useSearchParams();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/user/all", {
        withCredentials: true,
      });

      setUsers(data.users);

      const queryUserId = searchParams.get("userId");
      if (queryUserId) {
        const matchedUser = data.users.find((u) => u._id === queryUserId);
        if (matchedUser) {
          setSelectedUser(matchedUser);
        }
      }
    } catch (err) {
      console.error("❌ Failed to load users:", err.response?.data || err.message);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="messaging-container">
      <div className="user-list">
        <h4>Conversations</h4>
        {users.map((user) => (
          <div
            key={user._id}
            className={`user-item ${selectedUser?._id === user._id ? "active" : ""}`}
            onClick={() => setSelectedUser(user)}
          >
            {user.name}
          </div>
        ))}
      </div>

      <div className="chat-area">
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} />
        ) : (
          <p className="placeholder">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Messaging;
