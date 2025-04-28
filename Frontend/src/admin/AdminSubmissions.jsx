import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AdminSection.css";

const AdminSubmissions = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [submittedApps, setSubmittedApps] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate("/login");
    } else {
      fetchSubmittedApplications();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchSubmittedApplications = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/admin/applications`, {
        withCredentials: true,
      });

      // Filter only submitted applications
      const filtered = data.filter((app) => app.submissionStatus === "submitted");
      setSubmittedApps(filtered);
    } catch (error) {
      console.error("Error fetching submissions:", error.response?.data?.message);
    }
  };

  const approveAndReleasePayment = async (applicationId) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/application/verify-and-release/${applicationId}`,
        {},
        { withCredentials: true }
      );
      alert(res.data.message);
      fetchSubmittedApplications(); // refresh after approval
    } catch (error) {
      alert(error.response?.data?.message || "Failed to release payment");
    }
  };

  return (
    <div className="admin-section">
      <h2>Submitted Applications (Pending Approval)</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Work</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedApps.map((app) => (
            <tr key={app._id}>
              <td>{app.studentInfo?.name || "Unknown"}</td>
              <td>{app.studentInfo?.email || "Unknown"}</td>
              <td>{app.jobInfo?.jobTitle || "N/A"}</td>
              <td>
                {app.submittedWork ? (
                  <a href={app.submittedWork} target="_blank" rel="noopener noreferrer">
                    View Work
                  </a>
                ) : (
                  "Not submitted"
                )}
              </td>
              <td>{app.submissionStatus}</td>
              <td>{app.paymentStatus}</td>
              <td>
                <button className="approve-btn" onClick={() => approveAndReleasePayment(app._id)}>
                  ✅ Approve & Release
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSubmissions;
