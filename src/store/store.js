// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
});
