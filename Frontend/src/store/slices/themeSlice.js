import { createSlice } from "@reduxjs/toolkit";

// Get the initial theme from localStorage
const initialState = {
  theme: localStorage.getItem("chat-theme") || "coffee",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("chat-theme", action.payload); // Save theme to localStorage
    },
  },
});

// Export the action creator
export const { setTheme } = themeSlice.actions;

// Export the reducer
export default themeSlice.reducer;