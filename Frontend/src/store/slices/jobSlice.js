import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    message: null,
    singleJob: {},
    myJobs: [],
    appliedJobs: [], // New state to track jobs the user has applied for
    reviews: [],     // New state to track reviews submitted by the user
  },
  reducers: {
    requestForAllJobs(state, action) {
      state.loading = true;
      state.error = null;
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.jobs = action.payload;
      state.error = null;
    },
    failureForAllJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSingleJob(state, action) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForSingleJob(state, action) {
      state.loading = false;
      state.error = null;
      state.singleJob = action.payload;
    },
    failureForSingleJob(state, action) {
      state.singleJob = state.singleJob;
      state.error = action.payload;
      state.loading = false;
    },
    requestForPostJob(state, action) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForPostJob(state, action) {
      state.message = action.payload;
      state.error = null;
      state.loading = false;
    },
    failureForPostJob(state, action) {
      state.message = null;
      state.error = action.payload;
      state.loading = false;
    },

    requestForDeleteJob(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteJob(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    failureForDeleteJob(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    requestForMyJobs(state, action) {
      state.loading = true;
      state.myJobs = [];
      state.error = null;
    },
    successForMyJobs(state, action) {
      state.loading = false;
      state.myJobs = action.payload;
      state.error = null;
    },
    failureForMyJobs(state, action) {
      state.loading = false;
      state.myJobs = state.myJobs;
      state.error = action.payload;
    },

    clearAllErrors(state, action) {
      state.error = null;
      state.jobs = state.jobs;
    },

    requestForApplyJob(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForApplyJob(state, action) {
      state.loading = false;
      state.error = null;
      state.message = "Applied successfully!";
      state.appliedJobs.push(action.payload); // Add job to appliedJobs state
    },
    failureForApplyJob(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // For handling the action of submitting a review
    requestForSubmitReview(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForSubmitReview(state, action) {
      state.loading = false;
      state.error = null;
      state.message = "Review submitted successfully!";
      state.reviews.push(action.payload); // Add review to reviews state
    },
    failureForSubmitReview(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    resetJobSlice(state, action) {
      state.error = null;
      state.jobs = state.jobs;
      state.loading = false;
      state.message = null;
      state.myJobs = state.myJobs;
      state.singleJob = {};
      state.appliedJobs = [];  // Reset applied jobs
      state.reviews = [];
    },
  },
});

 
  
  // ✅ Fetch All Jobs (with filtering)
  export const fetchJobs =
    (category = "", subCategory = "", status = "") =>
    async (dispatch) => {
      try {
        dispatch(jobSlice.actions.requestForAllJobs());
        let link = "http://localhost:4000/api/v1/job/all?";
        let queryParams = [];
  
        if (category && category !== "All") queryParams.push(`category=${category}`);
        if (subCategory && subCategory !== "All") queryParams.push(`subCategory=${subCategory}`);
        if (status && status !== "All") queryParams.push(`status=${status}`);
  
       // if (queryParams.length) link += queryParams.join("&");
        link += queryParams.join("&");
        const response = await axios.get(link, { withCredentials: true });
        dispatch(jobSlice.actions.successForAllJobs(response.data.jobs));
        dispatch(jobSlice.actions.clearAllErrors());
      } catch (error) {
        dispatch(jobSlice.actions.failureForAllJobs(error.response?.data?.message || "Failed to fetch jobs"));
      }
    };
  
  // ✅ Fetch a Single Job by ID
  export const fetchSingleJob = (jobId) => async (dispatch) => {
    dispatch(jobSlice.actions.requestForSingleJob());
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/job/get/${jobId}`,
        { withCredentials: true }
      );
      dispatch(jobSlice.actions.successForSingleJob(response.data.job));
      dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(jobSlice.actions.failureForSingleJob(error.response?.data?.message || "Failed to fetch job details"));
    }
  };
  

export const postJob = (data) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForPostJob());
  try {
    const response = await axios.post(
      `http://localhost:4000/api/v1/job/post`,
      data,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(jobSlice.actions.successForPostJob(response.data.message));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForPostJob(error.response?.data?.message));
  }
};

export const getMyJobs = () => async (dispatch) => {
  dispatch(jobSlice.actions.requestForMyJobs());
  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/job/getmyjobs`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForMyJobs(response.data.myJobs));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForMyJobs(error.response?.data?.message));
  }
};

export const deleteJob = (id) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForDeleteJob());
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/v1/job/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForDeleteJob(response.data.message));
    dispatch(clearAllJobErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForDeleteJob(error.response?.data?.message));
  }
};

export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearAllErrors());
};

export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.resetJobSlice());
};

export const applyForJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForApplyJob());
  try {
    const response = await axios.post(
      `http://localhost:4000/api/v1/job/apply/${jobId}`,
      {}, // Pass any necessary data in the body
      { withCredentials: true }
    );
    // Once the application is successful, dispatch the success action
    dispatch(jobSlice.actions.successForApplyJob(response.data.job));
  } catch (error) {
    dispatch(jobSlice.actions.failureForApplyJob(error.response?.data?.message));
  }
};

export const submitReview = (jobId, rating, comment) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForSubmitReview());
  try {
    const response = await axios.post(
      `http://localhost:4000/api/v1/job/review/${jobId}`,
      { rating, comment },
      { withCredentials: true }
    );
    // Once the review is successfully submitted, dispatch the success action
    dispatch(jobSlice.actions.successForSubmitReview(response.data.review));
  } catch (error) {
    dispatch(jobSlice.actions.failureForSubmitReview(error.response?.data?.message));
  }
};


export default jobSlice.reducer;