import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";


const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState: {
    loading: false,
    error: null,
    isUpdated: false,
    user: null, // Store updated user info
  },
  reducers: {
    updateProfileRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.error = null;
      state.user = action.payload; // Store updated user data
    },
    updateProfileFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updatePasswordSuccess(state) {
      state.loading = false;
      state.isUpdated = true;
      state.error = null;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
    },
    profileResetAfterUpdate(state) {
      state.loading = false;
      state.isUpdated = false;
      state.error = null;
    },
  },
});

// **Async Thunk for Updating Profile**
export const updateProfile = (data) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.updateProfileRequest());
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/user/update/profile`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(updateProfileSlice.actions.updateProfileSuccess(response.data.user));
  } catch (error) {
    dispatch(
      updateProfileSlice.actions.updateProfileFailed(
        error.response?.data?.message || "Failed to update profile."
      )
    );
  }
};

// **Async Thunk for Updating Password**
export const updatePassword = (data) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.updatePasswordRequest());
  try {
    await axios.put(
      `${API_BASE_URL}/api/v1/user/update/password`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(updateProfileSlice.actions.updatePasswordSuccess());
  } catch (error) {
    dispatch(
      updateProfileSlice.actions.updatePasswordFailed(
        error.response?.data?.message || "Failed to update password."
      )
    );
  }
};

// **Reset Error & Update State**
export const clearAllUpdateProfileErrors = () => (dispatch) => {
  dispatch(updateProfileSlice.actions.profileResetAfterUpdate());
};

export default updateProfileSlice.reducer;
