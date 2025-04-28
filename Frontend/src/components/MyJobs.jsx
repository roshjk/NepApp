import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllErrors,
  deleteJob,
  resetJobSlice,
  fetchMyJobs, // ✅ updated import
} from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import "./MyJobs.css";

const MyJobs = () => {
  const { loading, error, myJobs, message } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
    }
    if (user) {
      dispatch(fetchMyJobs()); // ✅ changed from fetchMyJobsByUser()
    }
  }, [dispatch, error, message, user]);

  const handleDeleteJob = (id) => {
    dispatch(deleteJob(id));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : !myJobs || myJobs.length === 0 ? (
        <h2 style={{ fontWeight: 600 }}>You haven't posted any jobs yet.</h2>
      ) : (
        <div className="account_components">
          <h3>My Posted Jobs</h3>
          <div className="applications_container">
            {myJobs.map((job) => (
              <div className="card" key={job?._id || Math.random()}>
                {job?.jobThumbnail && (
                  <img
                    src={job.jobThumbnail}
                    alt="Thumbnail"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}

                <p><strong>Title:</strong> {job?.title || "Untitled"}</p>
                <p><strong>Category:</strong> {job?.category || "-"}</p>
                <p><strong>Price:</strong> ${job?.price || 0}</p>
                <p><strong>Delivery Time:</strong> {job?.deliveryTime || 0} days</p>
                <p><strong>Status:</strong> {job?.status || "unknown"}</p>
                <p><strong>Posted By:</strong> {job?.postedBy?.name || "Unknown"}</p>
                <p><strong>Email:</strong> {job?.postedBy?.email || "N/A"}</p>

                <button className="btn" onClick={() => handleDeleteJob(job?._id)}>
                  Delete Job
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MyJobs;
