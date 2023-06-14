import { createSlice } from "@reduxjs/toolkit";
import {
  createRecycleLocation,
  deleteRecycleLocation,
  getAllRecycleLocation,
  getAllRecycleLocationByPageAndKeyword,
  getRecycleLocationById,
  updateRecycleLocationById,
} from "./recycleFunction/recycleLocationFunction";
import {
  createRecyclingHistory,
  deleteRecycleHistory,
  getMostRecycledWasteType,
  getAllRecyclingHistories,
  getRecycleHistoryById,
  getRecycleHistoryByUserIdAndPage,
  getRecyclingPercentagesByUser,
  getTotalRecyclingHistoryByUserId,
  updateRecycleHistoryById,
} from "./recycleFunction/recyclingHistoryFunction";

const initialState = {
  allRecycleLocations: [],
  recycleLocations: [],
  recycleLocationById: {},
  recycleHistoryById: {},
  allRecyclingHistories: [],
  totalRecyclingHistoryByUserId: {},
  recyclingHistoriesTop8: [],
  mostRecycledWasteType: {},
  wasteTypePercentages: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  error: "",
};

export const recycleSlice = createSlice({
  name: "recycle",
  initialState,
  reducers: {
    resetRecycling: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.allRecycleLocations =  [];
      state.allRecyclingHistories = [];
      state.recycleLocationById = {};
      state.error = "";
      state.recycleLocations = [];
      state.recycleLocationById = {};
      state.totalRecyclingHistoryByUserId = {};
      state.wasteTypePercentages= {};
      state.recycleHistoryById = {};
      state.recyclingHistoriesTop8 = [];
      state.mostRecycledWasteType = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Recycle Location
      .addCase(createRecycleLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRecycleLocation.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createRecycleLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create All Recycle Location By Page And Keyword
      .addCase(getAllRecycleLocationByPageAndKeyword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllRecycleLocationByPageAndKeyword.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.recycleLocations = action.payload;
        }
      )
      .addCase(
        getAllRecycleLocationByPageAndKeyword.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          state.recycleLocations = null;
        }
      )
      // Get All Recycle Location
      .addCase(getAllRecycleLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRecycleLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allRecycleLocations = action.payload;
      })
      .addCase(getAllRecycleLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.allRecycleLocations = null;
      })
      //Delete RecycleLocation
      .addCase(deleteRecycleLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRecycleLocation.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteRecycleLocation.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // Update Recycle Location By ID
      .addCase(updateRecycleLocationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRecycleLocationById.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateRecycleLocationById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Recycle Location By ID
      .addCase(getRecycleLocationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecycleLocationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recycleLocationById = action.payload;
      })
      .addCase(getRecycleLocationById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Recycling History Cases Start Here
       // Get All Recycle Histories
       .addCase(getAllRecyclingHistories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRecyclingHistories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allRecyclingHistories = action.payload;
      })
      .addCase(getAllRecyclingHistories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.allRecyclingHistories = null;
      })
      // Create Recycling History
      .addCase(createRecyclingHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRecyclingHistory.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createRecyclingHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Recycling History
      .addCase(deleteRecycleHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRecycleHistory.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteRecycleHistory.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // Update Recycle History By ID
      .addCase(updateRecycleHistoryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRecycleHistoryById.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateRecycleHistoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Recycle History By User ID and Page
      .addCase(getRecycleHistoryByUserIdAndPage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecycleHistoryByUserIdAndPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recyclingHistoriesTop8 = action.payload;
      })
      .addCase(getRecycleHistoryByUserIdAndPage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.recyclingHistoriesTop8 = [];
      })
      // Get Recycle History By ID
      .addCase(getRecycleHistoryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecycleHistoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recycleHistoryById = action.payload;
      })
      .addCase(getRecycleHistoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.recycleHistoryById = {};
      })
      // Get Total Recycling History By User ID
      .addCase(getTotalRecyclingHistoryByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTotalRecyclingHistoryByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.totalRecyclingHistoryByUserId = action.payload;
      })
      .addCase(getTotalRecyclingHistoryByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.totalRecyclingHistoryByUserId = {};
      })
      // Get Most Recycled Waste Tyoe
      .addCase(getMostRecycledWasteType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMostRecycledWasteType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.mostRecycledWasteType = action.payload;
      })
      .addCase(getMostRecycledWasteType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.mostRecycledWasteType = {};
      })
      // Get Percentage of Waste Type based on User ID
      .addCase(getRecyclingPercentagesByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getRecyclingPercentagesByUser.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.wasteTypePercentages = action.payload;
        }
      )
      .addCase(
        getRecyclingPercentagesByUser.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          state.wasteTypePercentages = null;
        }
      );
  },
});

export const { resetRecycling } = recycleSlice.actions;
export default recycleSlice.reducer;
