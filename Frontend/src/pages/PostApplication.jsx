import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleJob } from "../store/slices/jobSlice";
import {
  postApplication,
  clearAllApplicationErrors,
  resetApplicationSlice,
} from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import "./PostApplication.css";

const PostApplication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobId } = useParams();

  const { singleJob } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector((state) => state.applications);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  // Fetch job and pre-fill user details
  useEffect(() => {
    dispatch(fetchSingleJob(jobId));

    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter(user.coverLetter || "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
      navigate("/dashboard");
    }
  }, [dispatch, jobId, user, error, message, navigate]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    if (resume) formData.append("resume", resume);

    dispatch(postApplication(formData, jobId));
  };

  return (
    <section className="application_page">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h3>Apply for: {singleJob?.title || "Loading..."}</h3>

        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Cover Letter</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            required
          ></textarea>
        </div>

        <div>
          <label>Upload Resume (PDF only)</label>
          <input type="file" accept="application/pdf" onChange={handleResumeChange} required />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      <div className="job-details-preview">
        <h4>Job Preview</h4>
        <p><strong>Category:</strong> {singleJob?.category}</p>
        <p><strong>Sub-category:</strong> {singleJob?.subCategory}</p>
        <p><strong>Price:</strong> ₹{singleJob?.price}</p>
        <p><strong>Delivery Time:</strong> {singleJob?.deliveryTime} days</p>
        <p><strong>Revisions:</strong> {singleJob?.revisions}</p>
      </div>
    </section>
  );
};

export default PostApplication;
