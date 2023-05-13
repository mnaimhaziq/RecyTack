import { createAsyncThunk } from "@reduxjs/toolkit";
import recycleService from "../recycleService";

//Get All Recycle Location
export const getAllRecycleLocationByPageAndKeyword = createAsyncThunk(
    "recycle/getAllRecycleLocationByPageAndKeyword",
    async ({ token, page, search }, thunkAPI) => {
      try {
        const recycleLocations =
          await recycleService.getAllRecycleLocationByPageAndKeyword(
            token,
            page,
            search
          );
        return recycleLocations;
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
  
  // Update recycle collection by id
export const updateRecycleLocationById = createAsyncThunk(
    "recycle/updateRecycleLocationById",
    async ({ id, newFormData, token }, thunkAPI) => {
      try {
        const recycleCollection = await recycleService.updateRecycleLocationById(
          id,
          newFormData,
          token
        );
        return recycleCollection;
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

  export const getAllRecycleLocation = createAsyncThunk(
    "recycle/getAllRecycleLocation",
    async (token, thunkAPI) => {
      try {
        const recycleLocations = await recycleService.getAllRecycleLocation(
          token
        );
  
        return recycleLocations;
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
  
  //Create recycle Location
  export const createRecycleLocation = createAsyncThunk(
    "recycle/createRecycleCollection",
    async ({ newFormData, token }, thunkAPI) => {
      try {
        const RecycleLocation = await recycleService.createRecycleCollection(
          newFormData,
          token
        );
        return RecycleLocation;
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
  

  
  //Delete recycle collection
  export const deleteRecycleLocation = createAsyncThunk(
    "recycle/deleteRecycleCollection",
    async ({ id, token }, thunkAPI) => {
      try {
        const recycleCollection = await recycleService.deleteRecycleCollection(
          id,
          token
        );
        return recycleCollection;
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
  
 
  
  // Get recycle collection by id
  export const getRecycleLocationById = createAsyncThunk(
    "recycle/getRecycleLocationById",
    async ({ id, token }, thunkAPI) => {
      try {
        const recycleCollection = await recycleService.getRecycleLocationById(
          id,
          token
        );
        return recycleCollection;
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

  