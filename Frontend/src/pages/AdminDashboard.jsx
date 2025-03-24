import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css"; // Import CSS file

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



  // Fetch users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/users`, { withCredentials: true });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data?.message);
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/jobs`, { withCredentials: true });
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error.response?.data?.message);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/applications`, { withCredentials: true });
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error.response?.data?.message);
    }
  };

  // Delete user
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

  // Delete job
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

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <h2>Welcome, {user?.name}!</h2>

      {/* Users Section */}
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
                <button className="delete-btn" onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Job Posts Section */}
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
                <button className="delete-btn" onClick={() => deleteJob(job._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Applications Section */}
      <h3>Job Applications</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Applicant Name</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.applicantName}</td>
              <td>{app.email}</td>
              <td>{app.jobTitle}</td>
              <td>{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
