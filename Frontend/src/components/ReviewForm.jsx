import React, { useState } from "react";
import axios from "axios";

const ReviewForm = ({ reviewedUserId, jobId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:4000/api/v1/reviews", {
        reviewedUser: reviewedUserId,
        job: jobId,
        rating,
        comment,
      }, { withCredentials: true });

      alert("Review submitted");
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Submission failed");
    }
  };

  return (
    <div className="review-form">
      <h4>Leave a Review</h4>
      <select onChange={(e) => setRating(e.target.value)} value={rating}>
        <option value="">Rate</option>
        {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Star</option>)}
      </select>
      <textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Review</button>
    </div>
  );
};

export default ReviewForm;
