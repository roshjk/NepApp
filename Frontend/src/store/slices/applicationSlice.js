import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API base URL
const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    request(state) {
      state.loading = true;
      state.error = null;
    },
    success(state, action) {
      state.loading = false;
      state.applications = action.payload;
    },
    failure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestPost(state) {
      state.loading = true;
      state.error = null;
    },
    successPost(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    failurePost(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors(state) {
      state.error = null;
    },
    resetSlice(state) {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyKhaltiPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyKhaltiPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyKhaltiPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  request,
  success,
  failure,
  requestPost,
  successPost,
  failurePost,
  clearErrors,
  resetSlice,
} = applicationSlice.actions;

// Thunks
export const fetchBusinessApplications = () => async (dispatch) => {
  dispatch(request());
  try {
    const { data } = await API.get("/application/business/applications");
    dispatch(success(data.applications));
  } catch (err) {
    dispatch(failure(err.response?.data?.message || "Failed to load"));
  }
};

export const fetchStudentApplications = () => async (dispatch) => {
  dispatch(request());
  try {
    const { data } = await API.get("/application/student/applications");
    dispatch(success(data.applications));
  } catch (err) {
    dispatch(failure(err.response?.data?.message || "Failed to load"));
  }
};

export const postApplication = (formData, jobId) => async (dispatch) => {
  dispatch(requestPost());
  try {
    const { data } = await API.post(`/application/apply/${jobId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(successPost(data.message));
  } catch (err) {
    dispatch(failurePost(err.response?.data?.message || "Application failed"));
  }
};

export const deleteApplication = (id) => async (dispatch) => {
  dispatch(requestPost());
  try {
    const { data } = await API.delete(`/application/delete/${id}`);
    dispatch(successPost(data.message));
  } catch (err) {
    dispatch(failurePost(err.response?.data?.message || "Delete failed"));
  }
};

export const updateApplicationStatus = (applicationId, status) => async (dispatch) => {
  dispatch(requestPost());
  try {
    const { data } = await API.put(`/application/update-status/${applicationId}`, { status });
    dispatch(successPost(data.message));
    dispatch(fetchBusinessApplications());
  } catch (err) {
    dispatch(failurePost(err.response?.data?.message || "Update failed"));
  }
};

export const submitWork = (applicationId, workUrl) => async (dispatch) => {
  dispatch(requestPost());
  try {
    const { data } = await API.put(`/application/submit-work/${applicationId}`, { workUrl });
    dispatch(successPost(data.message));
  } catch (err) {
    dispatch(failurePost(err.response?.data?.message || "Submit work failed"));
  }
};

export const verifyKhaltiPayment = createAsyncThunk(
  "applications/verifyKhaltiPayment",
  async ({ applicationId, token, amount }, thunkAPI) => {
    try {
      const res = await API.post("/payment/khalti-verify", {
        applicationId,
        token,
        amount,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Khalti verification failed");
    }
  }
);

export const verifyAndReleasePayment = (applicationId) => async (dispatch) => {
  dispatch(requestPost());
  try {
    const { data } = await API.put(`/application/verify-and-release/${applicationId}`);
    dispatch(successPost(data.message));
  } catch (err) {
    dispatch(failurePost(err.response?.data?.message || "Payment release failed"));
  }
};

export const clearAllApplicationErrors = () => (dispatch) => dispatch(clearErrors());
export const resetApplicationSlice = () => (dispatch) => dispatch(resetSlice());

export default applicationSlice.reducer;
