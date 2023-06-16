import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import recycleService from "./recycleService";

const initialState = {
  recycleLocations: [],
  recycleLocationById: {},
  recycleHistoryById: {},
  allRecyclingHistories: [],
  recyclingHistories: [],
  recyclingHistoriesTop8: [],
  mostRecycledWasteType: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  error: "",
};

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


//Create recycle collection
export const createRecycleLocation = createAsyncThunk(
  "recycle/createRecycleCollection",
  async ({ newFormData, token }, thunkAPI) => {
    try {
      const recycleCollection = await recycleService.createRecycleCollection(
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
export const getRecycleHistoryByUserId = createAsyncThunk(
  "recycle/getRecycleHistoryByUserId",
  async ({ id, token }, thunkAPI) => {
    try {
      const recycleHistory = await recycleService.getRecycleHistoryByUserId(
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

// Get Most Recycled Waste Type by id
export const getMostRecycledWasteType = createAsyncThunk(
  "recycle/getMostRecycledWasteType",
  async ({ id, token }, thunkAPI) => {
    try {
      const mostRecycledWasteType= await recycleService.getMostRecycledWasteType(
        id,
        token
      );
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

// Get All Recycling Histories
export const getAllRecyclingHistories = createAsyncThunk(
  "recycle/getAllRecyclingHistories",
  async (token, thunkAPI) => {
    try {
      const recycleHistories = await recycleService.getAllRecyclingHistories(
        token
      );
      return recycleHistories;
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
      const recyclingHistoriesTop8 = await recycleService.getRecycleHistoryByUserIdAndPage(
        id,
        page,
        token
      );
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

export const recycleSlice = createSlice({
  name: "recycle",
  initialState,
  reducers: {
    resetRecycling: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.recycleLocationById = {};
      state.error =  "";
      state.recycleLocations =[];
      state.recycleLocationById = {};
      state.recycleHistoryById = {};
      state.recyclingHistories = [];
      state.recyclingHistoriesTop8 = [];
      state.mostRecycledWasteType = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRecycleLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRecycleLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recycleLocations = action.payload;
      })
      .addCase(getAllRecycleLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.recycleLocations = null;
      })
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
      .addCase(createRecyclingHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRecyclingHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createRecyclingHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
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
      .addCase(deleteRecycleHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRecycleHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteRecycleHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getRecycleLocationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecycleLocationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recycleLocationById = action.payload;
      })
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
      }).addCase(getMostRecycledWasteType.pending, (state) => {
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
      }).addCase(getRecycleHistoryByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecycleHistoryByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recyclingHistories = action.payload;
      })
      .addCase(getRecycleHistoryByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.recyclingHistories = [];
      })
      .addCase(getRecycleHistoryByUserIdAndPage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecycleHistoryByUserIdAndPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recyclingHistoriesTop8 = action.payload;
      })
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
      .addCase(getRecycleHistoryByUserIdAndPage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.recyclingHistoriesTop8 = [];
      })
      .addCase(updateRecycleLocationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRecycleLocationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateRecycleLocationById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateRecycleHistoryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRecycleHistoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateRecycleHistoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });;
  },
});

export const { resetRecycling } = recycleSlice.actions;
export default recycleSlice.reducer;
