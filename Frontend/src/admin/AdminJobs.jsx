import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AdminSection.css";

const API_BASE_URL = "http://localhost:4000/api/admin";

const AdminJobs = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate("/login");
    } else {
      fetchJobs();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/jobs`, { withCredentials: true });
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error.response?.data?.message);
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

  const updateJob = async (id) => {
    const newTitle = prompt("Enter new title for the job:");
    if (!newTitle) return;

    try {
      const { data } = await axios.put(`${API_BASE_URL}/job/${id}`, { title: newTitle }, { withCredentials: true });
      setJobs(jobs.map((job) => (job._id === id ? data : job)));
    } catch (error) {
      console.error("Error updating job:", error.response?.data?.message);
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Job Posts</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Posted By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.category}</td>
              <td>{job.postedBy?.name || "N/A"}</td>

              <td>
                <button className="update-btn" onClick={() => updateJob(job._id)}>Update</button>
                <button className="delete-btn" onClick={() => deleteJob(job._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminJobs;
