import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import recycleService from "./recycleService";


const initialState = {
    recycleLocations: [],
    recycleLocationById: {},
    wasteType: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    error: "",
}

//Get All Recycle Location
export const getAllRecycleLocation = createAsyncThunk("recycle/getAllRecycleLocation", async ({token, page}, thunkAPI) => {
    try {
      console.log("page: " + page);
      const recycleLocations = await recycleService.getAllRecycleLocation(token, page);
      return recycleLocations;
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

    //Create recycle collection
    export const createRecycleCollection = createAsyncThunk("recycle/createRecycleCollection", async ({newFormData, token}, thunkAPI) => {
      try {
        const recycleCollection = await recycleService.createRecycleCollection(newFormData, token);
        return recycleCollection;
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

        // Get recycle collection by id
        export const getRecycleLocationById = createAsyncThunk("recycle/getRecycleLocationById", async ({id, token}, thunkAPI) => {
          try {
            const recycleCollection = await recycleService.getRecycleLocationById(id, token);
            return recycleCollection;
          } catch (error) {
            const message =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error;
            return thunkAPI.rejectWithValue(message);
          }
        });

                // Update recycle collection by id
                export const updateRecycleLocationById = createAsyncThunk("recycle/updateRecycleLocationById", async ({id, newFormData, token}, thunkAPI) => {
                  try {
                    const recycleCollection = await recycleService.updateRecycleLocationById(id, newFormData, token);
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
          }).addCase(createRecycleCollection.pending, (state) => {
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
          }).addCase(getRecycleLocationById.pending, (state) => {
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
            state.recycleLocationById = {};
          }).addCase(updateRecycleLocationById.pending, (state) => {
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
    },
  });

  export const { reset} = recycleSlice.actions;
export default recycleSlice.reducer;