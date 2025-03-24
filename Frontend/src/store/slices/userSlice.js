import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    error: null,
    message: null,
    socket: null,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    fetchUserRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = "Logged out successfully.";
    },
    logoutFailed(state, action) {
      state.error = action.payload;
    },
    clearAllErrors(state) {
      state.error = null;
    },
    /*setSocket(state, action) {
      if (action.payload) {
        state.socket = action.payload;
      }
    },
    disconnectSocket(state) {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.socket = null;
    },*/
  },
});

// **Export actions**
export const {
  registerRequest,
  registerSuccess,
  registerFailed,
  loginRequest,
  loginSuccess,
  loginFailed,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailed,
  logoutSuccess,
  logoutFailed,
  clearAllErrors,
  //setSocket,
 // disconnectSocket,
} = userSlice.actions;

// **Async Thunk: Register User**
export const register = (data) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/user/register`, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(registerSuccess(response.data));
  } catch (error) {
    dispatch(registerFailed(error.response?.data?.message || "Registration failed."));
  }
};

// **Async Thunk: Login User**
export const login = (data) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/user/login`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.data);
    dispatch(loginSuccess(response.data));
    //dispatch(connectSocket(response.data.user._id));
  } catch (error) {
    dispatch(loginFailed(error.response?.data?.message || "Login failed."));
  }
};

// **Async Thunk: Fetch User**
export const getUser = () => async (dispatch) => {
  dispatch(fetchUserRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/user/getuser`, {
      withCredentials: true,
    });
    dispatch(fetchUserSuccess(response.data.user));
  } catch (error) {
    dispatch(fetchUserFailed(error.response?.data?.message || "Failed to fetch user."));
  }
};

// **Async Thunk: Logout User**
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${API_BASE_URL}/api/v1/user/logout`, { withCredentials: true });
    dispatch(logoutSuccess());
    dispatch(disconnectSocket());
  } catch (error) {
    dispatch(logoutFailed(error.response?.data?.message || "Logout failed."));
  }
};

// **Socket.IO Connection**
/*
export const connectSocket = (userId) => (dispatch, getState) => {
  const existingSocket = getState().user.socket;
  if (existingSocket) {
    existingSocket.disconnect();
  }

  const socket = io(API_BASE_URL, { query: { userId } });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  dispatch(setSocket(socket));
};

// **Disconnect Socket**
export const disconnectSocketAction = () => (dispatch, getState) => {
  const socket = getState().user.socket;
  if (socket) {
    socket.disconnect();
  }
  dispatch(disconnectSocket());
};
*/
// **Clear Errors**
export const clearAllUserErrors = () => (dispatch) => {
  dispatch(clearAllErrors());
};

export default userSlice.reducer;
