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
  },
  reducers: {
    requestForAllJobs(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.jobs = action.payload.jobs;
      state.error = null;
    },
    failureForAllJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForSingleJob(state) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForSingleJob(state, action) {
      state.loading = false;
      state.error = null;
      state.singleJob = action.payload.job;
    },
    failureForSingleJob(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    requestForPostJob(state) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForPostJob(state, action) {
      state.message = action.payload.message;
      state.error = null;
      state.loading = false;
      if (action.payload.job) {
        state.jobs.push(action.payload.job);
      }
    },
    failureForPostJob(state, action) {
      state.message = null;
      state.error = action.payload;
      state.loading = false;
    },

    requestForDeleteJob(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteJob(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
      state.myJobs = state.myJobs.filter(job => job._id !== action.payload.jobId);
    },
    failureForDeleteJob(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    requestForMyJobs(state) {
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
      state.error = action.payload;
    },

    assignJobRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    assignJobSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.error = null;
    },
    assignJobFailure(state, action) {
      state.loading = false;
      state.message = null;
      state.error = action.payload;
    },

    completeJobRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    completeJobSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.error = null;
    },
    completeJobFailure(state, action) {
      state.loading = false;
      state.message = null;
      state.error = action.payload;
    },

    reviewJobRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    reviewJobSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.error = null;
    },
    reviewJobFailure(state, action) {
      state.loading = false;
      state.message = null;
      state.error = action.payload;
    },

    clearAllErrors(state) {
      state.error = null;
    },
    resetJobSlice(state) {
      state.error = null;
      state.jobs = [];
      state.loading = false;
      state.message = null;
      state.myJobs = [];
      state.singleJob = {};
    },
  },
});

export const fetchJobs = (query = {}) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestForAllJobs());
    const response = await axios.get("http://localhost:4000/api/v1/job/all", {
      params: query,
      withCredentials: true,
    });
    dispatch(jobSlice.actions.successForAllJobs(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.failureForAllJobs(error.response?.data?.message || "Failed to fetch jobs"));
  }
};

export const fetchSingleJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForSingleJob());
  try {
    const response = await axios.get(`http://localhost:4000/api/v1/job/${jobId}`, {
      withCredentials: true,
    });
    dispatch(jobSlice.actions.successForSingleJob(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.failureForSingleJob(error.response?.data?.message || "Failed to fetch job"));
  }
};

export const postJob = (data) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForPostJob());
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/job/post",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(jobSlice.actions.successForPostJob(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.failureForPostJob(error.response?.data?.message));
  }
};

export const updateJob = (jobId, data) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForPostJob());
  try {
    const response = await axios.put(
      `http://localhost:4000/api/v1/job/${jobId}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(
      jobSlice.actions.successForPostJob({
        message: "Job updated successfully",
        job: response.data.updatedJob,
      })
    );
  } catch (error) {
    dispatch(jobSlice.actions.failureForPostJob(error.response?.data?.message));
  }
};

export const deleteJob = (id) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForDeleteJob());
  try {
    const response = await axios.delete(`http://localhost:4000/api/v1/job/${id}`, {
      withCredentials: true,
    });
    dispatch(jobSlice.actions.successForDeleteJob({ ...response.data, jobId: id }));
  } catch (error) {
    dispatch(jobSlice.actions.failureForDeleteJob(error.response?.data?.message));
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

export const fetchMyJobs = () => async (dispatch) => {
  dispatch(jobSlice.actions.requestForMyJobs());
  try {
    const { data } = await axios.get("http://localhost:4000/api/v1/job/my-jobs", {
      withCredentials: true,
    });
    dispatch(jobSlice.actions.successForMyJobs(data.jobs));
  } catch (error) {
    dispatch(jobSlice.actions.failureForMyJobs(error.response?.data?.message));
  }
};


export const assignJob = (jobId, studentId) => async (dispatch) => {
  dispatch(jobSlice.actions.assignJobRequest());
  try {
    const response = await axios.put(
      `http://localhost:4000/api/v1/job/${jobId}/assign`,
      { studentId },
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.assignJobSuccess(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.assignJobFailure(error.response?.data?.message));
  }
};

export const completeJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.completeJobRequest());
  try {
    const response = await axios.put(
      `http://localhost:4000/api/v1/job/${jobId}/complete`,
      {},
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.completeJobSuccess(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.completeJobFailure(error.response?.data?.message));
  }
};

export const submitReview = (jobId, reviewData) => async (dispatch) => {
  dispatch(jobSlice.actions.reviewJobRequest());
  try {
    const response = await axios.post(
      `http://localhost:4000/api/v1/job/${jobId}/review`,
      reviewData,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.reviewJobSuccess(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.reviewJobFailure(error.response?.data?.message));
  }
};

export const { clearAllErrors, resetJobSlice } = jobSlice.actions;
export default jobSlice.reducer;
