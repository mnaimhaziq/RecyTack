import { createAsyncThunk } from "@reduxjs/toolkit";
import recycleService from "../recycleService";

//Create Recycling History
export const createRecyclingHistory = createAsyncThunk(
    "recycle/createRecyclingHistory",
    async ({ newFormData, token }, thunkAPI) => {
      try {
        const recycleHistory = await recycleService.createRecyclingHistory(
          newFormData,
          token
        );
        return recycleHistory;
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

 //Delete recycling History
 export const deleteRecycleHistory = createAsyncThunk(
  "recycle/deleteRecycleHistory",
  async ({ id, token }, thunkAPI) => {
    try {
      const recycleHistory = await recycleService.deleteRecycleHistory(
        id,
        token
      );
      return recycleHistory;
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

// Get recycle History by id
export const getRecycleHistoryById = createAsyncThunk(
  "recycle/getRecycleHistoryById",
  async ({ id, token }, thunkAPI) => {
    try {
      const recycleHistory = await recycleService.getRecycleHistoryById(
        id,
        token
      );
      return recycleHistory;
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

// Get Recycle History by User ID
export const getTotalRecyclingHistoryByUserId = createAsyncThunk(
  "recycle/getTotalRecyclingHistoryByUserId",
  async ({ id, token }, thunkAPI) => {
    try {
      const totalRecyclingHistoryByUserId =
        await recycleService.getTotalRecyclingHistoryByUserId(id, token);
      return totalRecyclingHistoryByUserId;
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

// Get Most Recycled Waste Type by id
export const getMostRecycledWasteType = createAsyncThunk(
  "recycle/getMostRecycledWasteType",
  async ({ id, token }, thunkAPI) => {
    try {
      const mostRecycledWasteType =
        await recycleService.getMostRecycledWasteType(id, token);
      return mostRecycledWasteType;
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

// Get Recycle History by User ID and Page
export const getRecycleHistoryByUserIdAndPage = createAsyncThunk(
  "recycle/getRecycleHistoryByUserIdAndPage",
  async ({ id, page, token }, thunkAPI) => {
    try {
      const recyclingHistoriesTop8 =
        await recycleService.getRecycleHistoryByUserIdAndPage(id, page, token);
      return recyclingHistoriesTop8;
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



// Update recycle history by id
export const updateRecycleHistoryById = createAsyncThunk(
  "recycle/updateRecycleHistoryById",
  async ({ id, newFormData, token }, thunkAPI) => {
    try {
      const recycleHistory = await recycleService.updateRecycleHistoryById(
        id,
        newFormData,
        token
      );
      return recycleHistory;
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

// Get Percentage of Waste Type based on User ID
export const getRecyclingPercentagesByUser = createAsyncThunk(
  "recycle/getRecyclingPercentagesByUser",
  async ({ id, token }, thunkAPI) => {
    try {
      const recyclingPercentagesByUser =
        await recycleService.getRecyclingPercentagesByUser(id, token);
      return recyclingPercentagesByUser;
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