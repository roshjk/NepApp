import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentApplications,
  deleteApplication,
  submitWork,
  clearAllApplicationErrors,
  resetApplicationSlice,
} from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import "./MyApplication.css"
const MyApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error, message } = useSelector((state) => state.applications);

  const [workText, setWorkText] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    dispatch(fetchStudentApplications());
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

  const handleDelete = (id) => {
    dispatch(deleteApplication(id));
  };

  const handleSubmitWork = (id) => {
    const text = workText[id];
    if (!text || text.trim().length < 5) {
      toast.error("Please enter a valid work submission.");
      return;
    }

    setSubmittingId(id);
    dispatch(submitWork(id, text)).finally(() => {
      setSubmittingId(null);
    });
  };

  return loading ? (
    <Spinner />
  ) : (
    <section className="account_components">
      <h3>My Job Applications</h3>

      {!applications?.length ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="applications_container">
          {applications.map((app) => (
            <div key={app._id} className="card">
              <p><strong>Job Title:</strong> {app.jobInfo?.title}</p>
              <p><strong>Category:</strong> {app.jobInfo?.category}</p>
              <p><strong>Price:</strong> ₹{app.jobInfo?.price}</p>
              <p><strong>Delivery Time:</strong> {app.jobInfo?.deliveryTime} days</p>
              <p><strong>Revisions:</strong> {app.jobInfo?.revisions}</p>

              <p><strong>Business Name:</strong> {app.businessInfo?.name}</p>
              <p><strong>Business Email:</strong> {app.businessInfo?.email}</p>

              <p><strong>Status:</strong> {app.status}</p>
              <p><strong>Submission Status:</strong> {app.submissionStatus}</p>
              <p><strong>Payment Status:</strong> {app.paymentStatus}</p>

              <p><strong>Cover Letter:</strong></p>
              <textarea value={app.coverLetter} rows={4} disabled style={{ width: "100%" }} />

              {/* Submitted Work Display */}
              {app.submittedWork && (
                <>
                  <p><strong>Submitted Work:</strong></p>
                  <textarea value={app.submittedWork} disabled rows={3} style={{ width: "100%" }} />
                </>
              )}

              {/* Conditional Submit Work Section */}
              {app.status === "accepted" &&
                app.paymentStatus === "pending" &&
                app.submissionStatus === "none" && (
                  <>
                    <p><strong>Submit Your Work:</strong></p>
                    <textarea
                      rows={3}
                      placeholder="Enter your work link or details here..."
                      value={workText[app._id] || ""}
                      onChange={(e) =>
                        setWorkText({ ...workText, [app._id]: e.target.value })
                      }
                      style={{ width: "100%" }}
                    />
                    <button
                      className="btn"
                      onClick={() => handleSubmitWork(app._id)}
                      disabled={submittingId === app._id}
                    >
                      {submittingId === app._id ? "Submitting..." : "Submit Work"}
                    </button>
                  </>
              )}

              {app.resumeUrl && (
                <Link to={app.resumeUrl} className="btn" target="_blank">
                  View Resume (PDF)
                </Link>
              )}

              <button className="outline_btn" onClick={() => handleDelete(app._id)}>
                Delete Application
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyApplications;
