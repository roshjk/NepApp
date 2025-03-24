import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
  },
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    setUsersLoading(state, action) {
      state.isUsersLoading = action.payload;
    },
    setMessagesLoading(state, action) {
      state.isMessagesLoading = action.payload;
    },
  },
});

// Export actions
export const {
  setMessages,
  setUsers,
  setSelectedUser,
  setUsersLoading,
  setMessagesLoading,
} = chatSlice.actions;

// Export async actions
export const getUsers = () => async (dispatch) => {
  dispatch(setUsersLoading(true));
  try {
    const res = await axios.get("/messages/users");
    dispatch(setUsers(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch users.");
  } finally {
    dispatch(setUsersLoading(false));
  }
};

export default chatSlice.reducer;