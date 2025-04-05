import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <img src={job.jobThumbnail} alt={job.title} className="job-thumbnail" />
      <div className="job-details">
        <h3>{job.title}</h3>
        <p>{job.description}</p>
        <p>Category: {job.category}</p>
        <p>Status: {job.status}</p>
        <p>Price: ${job.price}</p>
        <Link to={`/apply/${job._id}`} className="apply-now-button">
    Apply Now
  </Link>
      </div>
    </div>
  );
};

export default JobCard;
