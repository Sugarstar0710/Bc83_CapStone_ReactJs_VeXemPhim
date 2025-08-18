import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./slices/user";

const store = configureStore({
  reducer: {
    user: useReducer,
  },
  devTools: true,
});

export default store;
