import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllErrors,
  deleteJob,
  getMyJobs,
  resetJobSlice,
} from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";

const MyJobs = () => {
  const { loading, error, myJobs, message } = useSelector(
    (state) => state.jobs
  );
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
    dispatch(getMyJobs());
  }, [dispatch, error, message]);

  const handleDeleteJob = (id) => {
    dispatch(deleteJob(id));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : myJobs && myJobs.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not posted any job!
        </h1>
      ) : (
        <div className="account_components">
          <h3>My Jobs</h3>
          <div className="applications_container">
            {myJobs.map((job) => (
              <div className="card" key={job._id}>
                {job.jobThumbnail && (
                  <img
                    src={job.jobThumbnail}
                    alt="Thumbnail"
                    style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
                  />
                )}

                <p className="sub-sec">
                  <span>Title:</span> {job.title}
                </p>
                <p className="sub-sec">
                  <span>Description:</span> {job.description}
                </p>
                <p className="sub-sec">
                  <span>Category:</span> {job.category}
                </p>
                {job.subCategory && (
                  <p className="sub-sec">
                    <span>Sub-category:</span> {job.subCategory}
                  </p>
                )}
                <p className="sub-sec">
                  <span>Tags:</span> {Array.isArray(job.tags) ? job.tags.join(", ") : job.tags}
                </p>
                <p className="sub-sec">
                  <span>Price:</span> ${job.price}
                </p>
                <p className="sub-sec">
                  <span>Delivery Time:</span> {job.deliveryTime} day(s)
                </p>
                {job.revisions && (
                  <p className="sub-sec">
                    <span>Revisions:</span> {job.revisions}
                  </p>
                )}
                <p className="sub-sec">
                  <span>Features:</span>{" "}
                  {Array.isArray(job.features) ? job.features.join(", ") : job.features}
                </p>

                <button
                  className="btn"
                  onClick={() => handleDeleteJob(job._id)}
                >
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
