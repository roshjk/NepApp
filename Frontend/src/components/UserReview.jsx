import React, { useEffect, useState } from "react";
import axios from "axios";

const UserReviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/v1/reviews/${userId}`)
      .then(res => setReviews(res.data.reviews))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div className="user-reviews">
      <h4>User Ratings</h4>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(r => (
          <div key={r._id}>
            <p><strong>{r.reviewer.name}</strong> rated <strong>{r.rating}/5</strong></p>
            <p><i>{r.comment}</i></p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserReviews;
