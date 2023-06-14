import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
// Get user from localStorage
const user = JSON.parse(localStorage.getItem("userInfo"));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  getUsersByPage: [],
  AllUsers: [] ,

};

//Register user
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
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

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error;
    return thunkAPI.rejectWithValue(message);
  }
});

//Update User Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (user, thunkAPI) => {
    try {
      return await authService.updateProfile(user);
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



//Get Users By Page
export const getUsersByPage = createAsyncThunk("auth/getUsersByPage", async ({token, page, search}, thunkAPI) => {
  try {
    const users = await authService.getUsersByPage(token, page, search);
    return users;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error;
    return thunkAPI.rejectWithValue(message);
  }
});

//Get All Users
export const getAllUsers = createAsyncThunk("auth/getAllUsers", async ({token, page, search}, thunkAPI) => {
  try {
    const users = await authService.getAllUsers(token);
    return users;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error;
    return thunkAPI.rejectWithValue(message);

  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});


// Update Dark Mode
export const updateDarkMode = createAsyncThunk(
  "auth/updateDarkMode",
  async ({ userId, darkMode, token }, thunkAPI) => {
    try {
      const updatedUser = await authService.updateDarkMode(userId, darkMode, token);
      thunkAPI.dispatch(setMode()); // Update the local state with the new dark mode value
      return updatedUser;
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

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    setMode: (state) => {
      state.user.darkMode = state.user.darkMode === "light" ? "dark" : "light";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.isError = false;
        state.isSuccess = false;
        state.user = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(getUsersByPage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersByPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.getUsersByPage = action.payload;
      })
      .addCase(getUsersByPage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.getUsersByPage = null;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.AllUsers = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.AllUsers = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.getUsersByPage = [];
        state.AllUsers = []
      }).addCase(updateDarkMode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDarkMode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateDarkMode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

      });
  },
});


export const { resetUser, setMode} = authSlice.actions;
export default authSlice.reducer;
