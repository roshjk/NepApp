import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice"; // Adjust path as necessary
import JobCard from "../components/JobCard"; // Create a separate component to display each job
import Pagination from "../components/Pagination"; // Create a pagination component
import "./jobs.css"; // Add your CSS styles
const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error, message } = useSelector((state) => state.jobs);
  
  const [searchKeyword, setSearchKeyword] = useState(""); // for searching jobs
  const [category, setCategory] = useState(""); // filter by category
  const [status, setStatus] = useState(""); // filter by status
  const [page, setPage] = useState(1); // pagination

  // Fetch jobs when component mounts or filters change
  useEffect(() => {
    const query = {
      searchKeyword,
      category,
      status,
    };
    dispatch(fetchJobs(query, page, 10)); // Adjust pagination limit as needed
  }, [dispatch, searchKeyword, category, status, page]);

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="job-listing-page">
      <h1>Job Listings</h1>

      {message && <div className="message">{message}</div>}

      {/* Filter Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search Jobs"
          value={searchKeyword}
          onChange={handleSearch}
        />
        
        <select onChange={handleCategoryChange} value={category}>
          <option value="">Select Category</option>
          <option value="IT">IT</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="UI/UX">UI/UX</option>
          <option value="Web Developement">Web Developement</option>
          <option value="Graphic Designer">Graphic Designer</option>
          {/* Add more categories as necessary */}
        </select>

        <select onChange={handleStatusChange} value={status}>
          <option value="">Select Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="in-progress">In Progress</option>
        </select>
      </div>

      {/* Job Listings */}
      <div className="job-list">
        {jobs.length === 0 ? (
          <div>No jobs available</div>
        ) : (
          jobs.map((job) => <JobCard key={job._id} job={job} />) // Create a JobCard component for displaying each job
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalItems={jobs.length} // Adjust this according to the API response
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Jobs;
