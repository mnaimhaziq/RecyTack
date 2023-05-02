import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import recycleService from "./recycleService";

const initialState = {
  recycleLocations: [],
  recycleLocationById: {},
  recycleHistoryById: {},
  recyclingHistories: [],

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
export const createRecycleCollection = createAsyncThunk(
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
export const deleteRecycleCollection = createAsyncThunk(
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
  async ({ id, page, token }, thunkAPI) => {
    try {
      const recycleHistory = await recycleService.getRecycleHistoryByUserId(
        id,
        page,
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
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.recycleLocationById = {};
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
      .addCase(createRecycleCollection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRecycleCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createRecycleCollection.rejected, (state, action) => {
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
      })
      .addCase(getRecycleHistoryByUserId.pending, (state) => {
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

export const { reset } = recycleSlice.actions;
export default recycleSlice.reducer;
