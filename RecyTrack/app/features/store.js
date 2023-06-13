import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";
import authReducer from "./auth/authSlice";
import recycleReducer from "./recycle/recycleSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    auth: authReducer,
    recycle: recycleReducer,
  },
});