import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const API_BASE_URL = "http://localhost:4000/api/admin";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate("/login");
    }
    fetchUsers();
    fetchJobs();
    fetchApplications();
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/users`, { withCredentials: true });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data?.message);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/jobs`, { withCredentials: true });
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error.response?.data?.message);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/applications`, { withCredentials: true });
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error.response?.data?.message);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_BASE_URL}/user/${id}`, { withCredentials: true });
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error.response?.data?.message);
      }
    }
  };

  const updateUser = async (id, updatedData) => {
    try {
      const { data } = await axios.put(`${API_BASE_URL}/user/${id}`, updatedData, { withCredentials: true });
      setUsers(users.map((user) => (user._id === id ? data : user)));
    } catch (error) {
      console.error("Error updating user:", error.response?.data?.message);
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${API_BASE_URL}/job/${id}`, { withCredentials: true });
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (error) {
        console.error("Error deleting job:", error.response?.data?.message);
      }
    }
  };

  const updateJob = async (id, updatedData) => {
    try {
      const { data } = await axios.put(`${API_BASE_URL}/job/${id}`, updatedData, { withCredentials: true });
      setJobs(jobs.map((job) => (job._id === id ? data : job)));
    } catch (error) {
      console.error("Error updating job:", error.response?.data?.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <h2>Welcome, {user?.name}!</h2>

      <h3>Users</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button className="update-btn" onClick={() => updateUser(user._id, { name: "Updated Name" })}>Update</button>
                <button className="delete-btn" onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Job Posts</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>
                <button className="update-btn" onClick={() => updateJob(job._id, { title: "Updated Title" })}>Update</button>
                <button className="delete-btn" onClick={() => deleteJob(job._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
