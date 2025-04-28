import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AdminSection.css";

const API_BASE_URL = "http://localhost:4000/api/admin";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/users`, { withCredentials: true });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data?.message);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_BASE_URL}/user/${id}`, { withCredentials: true });
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error.response?.data?.message);
      }
    }
  };

  const updateUser = async (id) => {
    const newName = prompt("Enter new name for the user:");
    if (!newName) return;

    try {
      const { data } = await axios.put(`${API_BASE_URL}/user/${id}`, { name: newName }, { withCredentials: true });
      setUsers(users.map((u) => (u._id === id ? data : u)));
    } catch (error) {
      console.error("Error updating user:", error.response?.data?.message);
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Users</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => updateUser(u._id)} className="update-btn">Update</button>
                <button onClick={() => deleteUser(u._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
