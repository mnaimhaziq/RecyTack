import { createAsyncThunk } from "@reduxjs/toolkit";
import feedbackService from "../feedbackService";

//Create Feedback
export const createFeedback = createAsyncThunk(
    "feedback/create",
    async ({feedback, token },thunkAPI) => {
      try {
        return await feedbackService.createFeedback(feedback, token);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error;
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

  export const getAllFeedback = createAsyncThunk(
    "recycle/getAllFeedback",
    async (token, thunkAPI) => {
      try {
        const feedbacks = await feedbackService.getAllFeedback(
          token
        );
  
        return feedbacks;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error;
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  
