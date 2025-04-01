import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAllJobErrors, fetchJobs } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [category, setCategory] = useState("All");
  const [searchKeyword, setSearchKeyword] = useState("");

  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    dispatch(fetchJobs(category, searchKeyword));
  }, [dispatch, error, category, searchKeyword]);

  const handleSearch = () => {
    dispatch(fetchJobs(category, searchKeyword));
  };

  const categories = [
    "All",
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
  ];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="jobs">
          {/* Search Bar */}
          <div className="search-tab-wrapper">
            <input
              type="text"
              placeholder="Search for jobs..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>

          <div className="wrapper">
            {/* Filters */}
            <div className="filter-bar">
              <h3>Filter by Category</h3>
              {categories.map((cat, index) => (
                <div key={index} className="filter-option">
                  <input
                    type="radio"
                    id={`cat-${index}`}
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                  />
                  <label htmlFor={`cat-${index}`}>{cat}</label>
                </div>
              ))}
            </div>

            {/* Job Listings */}
            <div className="container">
              <div className="jobs_container">
                {jobs && jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div className="card" key={job._id}>
                      <p className="title">{job.title}</p>
                      <p className="category">{job.category}</p>
                      <p className="price">
                        <span>Price:</span> Rs. {job.price}
                      </p>
                      <p className="delivery">
                        <span>Delivery Time:</span> {job.deliveryTime} days
                      </p>
                      <p className="status">
                        <span>Status:</span> {job.status}
                      </p>
                      <div className="btn-wrapper">
                        <Link className="btn" to={`/post/application/${job._id}`}>
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-jobs">
                    <img src="/notfound.png" alt="No jobs found" />
                    <p>No jobs found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;
