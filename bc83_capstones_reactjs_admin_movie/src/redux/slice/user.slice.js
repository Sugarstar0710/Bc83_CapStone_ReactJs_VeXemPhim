import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, logout } = userReducer.actions;
export default userReducer.reducer;
