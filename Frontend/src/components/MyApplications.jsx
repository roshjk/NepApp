import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearAllApplicationErrors,
  resetApplicationSlice,
  deleteApplication,
  fetchStudentApplications,
} from "../store/slices/applicationSlice";
import Spinner from "../components/Spinner";

const MyApplications = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, error, applications, message } = useSelector(
    (state) => state.applications
  );
  const dispatch = useDispatch();

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
      dispatch(fetchStudentApplications());
    }
  }, [dispatch, error, message]);

  const handleDeleteApplication = (id) => {
    dispatch(deleteApplication(id));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications?.length === 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not applied for any job.
        </h1>
      ) : (
        <div className="account_components">
          <h3>My Applications For Jobs</h3>
          <div className="applications_container">
            {applications.map((application) => (
              <div className="card" key={application._id}>
                <p className="sub-sec">
                  <span>Job Title: </span> {application.jobInfo.jobTitle}
                </p>
                <p className="sub-sec">
                  <span>Name: </span> {application.studentInfo.name}
                </p>
                <p className="sub-sec">
                  <span>Email: </span> {application.studentInfo.email}
                </p>
                <p className="sub-sec">
                  <span>Phone: </span> {application.studentInfo.phone}
                </p>
                <p className="sub-sec">
                  <span>Address: </span> {application.studentInfo.address}
                </p>
                <p className="sub-sec">
                  <span>Cover Letter: </span>
                  <textarea
                    value={application.studentInfo.coverLetter}
                    rows={5}
                    disabled
                  ></textarea>
                </p>
                <div className="btn-wrapper">
                  <button
                    className="outline_btn"
                    onClick={() => handleDeleteApplication(application._id)}
                  >
                    Delete Application
                  </button>
                  {application.studentInfo?.resume?.url && (
                    <Link
                      to={application.studentInfo.resume.url}
                      className="btn"
                      target="_blank"
                    >
                      View Resume
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MyApplications;
