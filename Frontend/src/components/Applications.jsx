import React, { useEffect } from "react";
import axios from "axios";
import "./Application.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBusinessApplications,
  deleteApplication,
  updateApplicationStatus,
  clearAllApplicationErrors,
  resetApplicationSlice,
  verifyKhaltiPayment,
} from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import KhaltiCheckout from "khalti-checkout-web";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error, message } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    dispatch(fetchBusinessApplications());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
  }, [error, message, dispatch]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateApplicationStatus(id, newStatus));
  };

  const handleDelete = (id) => {
    dispatch(deleteApplication(id));
  };
  const handleViewProfile = (studentId) => {
    navigate(`/student/${studentId}`);
  };
  
  const handleKhaltiRedirectPayment = async (app) => {
    const formData = {
      return_url: "http://localhost:4000/api/v1/payment/khalti/callback", // redirect handled by backend
      website_url: "http://localhost:5173",
      amount: app.jobInfo?.price * 100, // in paisa
      purchase_order_id: app._id,
      purchase_order_name: app.jobInfo?.title || "Job Application",
      customer_info: {
        name: app.studentInfo?.name || "Unknown",
        email: app.studentInfo?.email || "test@example.com",
        phone: app.studentInfo?.phone || "9800000000", // test number
      },
    };
  
    try {
      const { data } = await axios.post(
        "/api/v1/payment/khalti/initiate", // This must be implemented in backend
        formData,
        { withCredentials: true }
      );
  
      if (data?.data?.payment_url) {
        window.location.href = data.data.payment_url;
      } else {
        toast.error("Payment URL not received.");
      }
    } catch (err) {
      console.error("Error initiating Khalti payment:", err);
      toast.error("Khalti payment initiation failed.");
    }
  };
  

  const navigate = useNavigate();
  const handleMessageClick = (userId) => {
    navigate(`/chat?userId=${userId}`);
  };


  return loading ? (
    <Spinner />
  ) : (
    <section className="account_components">
      <h3>Applications Received</h3>
      {!applications?.length ? (
        <p>No applications yet.</p>
      ) : (
        <div className="applications_container">
          {applications.map((app) => (
            <div key={app._id} className="card">
              <p>
                <strong>Job Title:</strong> {app.jobInfo?.title}
              </p>
              <p>
                <strong>Price:</strong> ₹{app.jobInfo?.price}
              </p>
               {/* Student Info */}
               <div className="student-info" onClick={() => handleViewProfile(app.studentInfo._id)}>
                <img
                  src={app.studentInfo?.profilePic?.url || "/profile/default-profile.png"}
                  alt="Student"
                  className="student-profile-img"
                />
                <span className="student-name">{app.studentInfo?.name}</span>
              </div>
              <p>
                <strong>Status:</strong>
                <select
                  value={app.status}
                  onChange={(e) =>
                    handleStatusChange(app._id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </p>

              <p>
                <strong>Payment:</strong> {app.paymentStatus}
              </p>

              {app.status === "accepted" && app.paymentStatus === "unpaid" && (
                <button className="btn" onClick={() => handleKhaltiRedirectPayment(app)}>
                  Pay Now with Khalti
                </button>
              )}

{app.resumeUrl && (
  <a href={app.resumeUrl} className="btn" target="_blank" rel="noopener noreferrer">
    View Resume
  </a>
)}

            <button
            className="btn"
            onClick={() => handleMessageClick(app.studentInfo._id)}
          >
            💬 Message
          </button>

              <button
                className="outline_btn"
                onClick={() => handleDelete(app._id)}
              >
                Delete Application
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Applications;
