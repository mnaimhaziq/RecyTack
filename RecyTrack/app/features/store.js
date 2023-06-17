import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";
import authReducer from "./auth/authSlice";
import recycleReducer from "./recycle/recycleSlice";
import feedbackReducer from "./feedback/feedbackSlice"

export const store = configureStore({
  reducer: {
    global: globalReducer,
    auth: authReducer,
    recycle: recycleReducer,
    feedback: feedbackReducer,

  },
});