import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AdminSection.css";

const API_BASE_URL = "http://localhost:4000/api/admin";

const AdminApplications = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate("/login");
    } else {
      fetchApplications();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/applications`, {
        withCredentials: true,
      });

      const filtered = data.filter((app) => app.studentInfo && app.jobInfo);
      setApplications(filtered);
    } catch (error) {
      console.error("Error fetching applications:", error.response?.data?.message);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/application/${id}`, {
        withCredentials: true,
      });
      setApplications(applications.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Error deleting:", error.response?.data?.message);
      alert("Failed to delete application");
    }
  };

  const updateStatus = async (id) => {
    const newStatus = prompt("Enter new submission status (none/submitted/approved/rejected):");
    if (!newStatus) return;

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/application/${id}`,
        { submissionStatus: newStatus },
        { withCredentials: true }
      );

      setApplications(applications.map((a) => (a._id === id ? { ...a, submissionStatus: newStatus } : a)));
    } catch (error) {
      console.error("Error updating:", error.response?.data?.message);
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-section">
      <h2>All Job Applications</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.studentInfo?.name || "Unknown"}</td>
              <td>{app.studentInfo?.email || "Unknown"}</td>
              <td>{app.jobInfo?.jobTitle || "Untitled"}</td>
              <td>{app.submissionStatus}</td>
              <td>{app.paymentStatus}</td>
              <td>
                <button className="update-btn" onClick={() => updateStatus(app._id)}>Update</button>
                <button className="delete-btn" onClick={() => deleteApplication(app._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminApplications;
