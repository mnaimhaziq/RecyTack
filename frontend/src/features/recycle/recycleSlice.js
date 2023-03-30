import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import recycleService from "./recycleService";


const initialState = {
    recycleLocation: [],
    wasteType: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    error: "",
}

//Get All Recycle Location
export const getAllRecycleLocation = createAsyncThunk("recycle/getAllRecycleLocation", async (token, thunkAPI) => {
    try {
      const recycleLocation = await recycleService.getAllRecycleLocation(token);
      return recycleLocation;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error;
      return thunkAPI.rejectWithValue(message);
    }
  });

  //Get all waste types
  export const getAllWasteTypes = createAsyncThunk("recycle/getAllWasteTypes", async (token, thunkAPI) => {
    try {
      const WasteTypes = await recycleService.getAllWasteTypes(token);
      return WasteTypes;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error;
      return thunkAPI.rejectWithValue(message);
    }
  });

    //Delete recycle collection
    export const deleteRecycleCollection = createAsyncThunk("recycle/deleteRecycleCollection", async ({id, token}, thunkAPI) => {
      try {
        const recycleCollection = await recycleService.deleteRecycleCollection(id, token);
        return recycleCollection;
      } catch (error) {
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error;
        return thunkAPI.rejectWithValue(message);
      }
    });


  export const recycleSlice = createSlice({
    name: "recycle",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAllRecycleLocation.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAllRecycleLocation.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.recycleLocation = action.payload;
        })
        .addCase(getAllRecycleLocation.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          state.recycleLocation = null;
        }) .addCase(getAllWasteTypes.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getAllWasteTypes.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.wasteType = action.payload;
          })
          .addCase(getAllWasteTypes.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.wasteType = null;
          }) 
          .addCase(deleteRecycleCollection.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(deleteRecycleCollection.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
          })
          .addCase(deleteRecycleCollection.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
          })
    },
  });

  export const { reset} = recycleSlice.actions;
export default recycleSlice.reducer;