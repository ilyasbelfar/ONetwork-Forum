import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  user: {},
  token: null,
  isHeaderLoading: false,
  isLoggedIn: false,
  login: {
    message: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  register: {
    message: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  sendEmailVerify: {
    message: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  emailVerify: {
    message: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  forgotPassword: {
    message: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  resetPassword: {
    message: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  updateUserProfileState: {
    message: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/login", { email, password });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/logout");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    { username, email, password, firstName, lastName },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post("/register", {
        username,
        email,
        password,
        firstName,
        lastName,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const refresh_token = createAsyncThunk(
  "auth/refresh_token",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/refresh_token");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (obj, { rejectWithValue }) => {
    const { username } = obj;
    try {
      const { data } = await axios.put(`/api/user/${username}`, obj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleUserFollow = createAsyncThunk(
  "auth/toggleUserFollow",
  async (username, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/user/${username}/follow`,
        username
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const sendEmailVerification = createAsyncThunk(
  "auth/sendEmailVerification",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/send-email-verification", { email });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const emailVerify = createAsyncThunk(
  "auth/emailVerify",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/verify-email", { token });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword, confirmNewPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/reset-password", {
        token,
        newPassword,
        confirmNewPassword,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/forgot-password", { email });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetLogin: (state) => {
      state.login = { ...initialState.login };
    },
    resetRegister: (state) => {
      state.register = { ...initialState.register };
    },
    resetUpdateProfile: (state) => {
      state.updateUserProfileState = { ...initialState.updateUserProfileState };
    },
    resetVerifyEmail: (state) => {
      state.emailVerify = { ...initialState.emailVerify };
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.login.isLoading = true;
      state.token = null;
      state.login.isError = null;
      state.login.isSuccess = null;
      state.login.message = "Verifying...";
    },
    [login.fulfilled]: (state, action) => {
      state.login.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${action.payload.token}`;
      state.login.isError = false;
      state.login.isSuccess = true;
      state.login.message = action.payload.message;
    },
    [login.rejected]: (state, action) => {
      state.login.isLoading = false;
      state.token = null;
      state.isLoggedIn = false;
      state.login.isSuccess = false;
      state.login.isError = true;
      state.login.message = action.payload.message;
    },
    [register.pending]: (state) => {
      state.register.isLoading = true;
      state.register.isError = null;
      state.register.isSuccess = null;
      state.register.message = "Signing Up...";
    },
    [register.fulfilled]: (state, action) => {
      state.register.isLoading = false;
      state.register.isError = false;
      state.register.isSuccess = true;
      state.register.message = action.payload.message;
    },
    [register.rejected]: (state, action) => {
      state.register.isLoading = false;
      state.register.isSuccess = false;
      state.register.isError = true;
      state.register.message = action.payload.message;
    },
    [refresh_token.pending]: (state) => {
      state.isHeaderLoading = true;
      state.token = null;
    },
    [refresh_token.fulfilled]: (state, action) => {
      state.isHeaderLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${action.payload.token}`;
    },
    [refresh_token.rejected]: (state) => {
      state.isHeaderLoading = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    },
    [logout.pending]: (state) => {
      state.isHeaderLoading = true;
    },
    [logout.fulfilled]: (state) => {
      state.isHeaderLoading = false;
      state.token = null;
      state.user = {};
      state.isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      axios.defaults.headers.common["Authorization"] = "Bearer ";
    },
    [logout.rejected]: (state) => {
      state.isHeaderLoading = false;
      state.token = null;
    },
    [toggleUserFollow.pending]: (state) => {
      state.isLoading = true;
    },
    [toggleUserFollow.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    [toggleUserFollow.rejected]: (state) => {
      state.isLoading = false;
    },
    [updateUserProfile.pending]: (state) => {
      state.updateUserProfileState.isLoading = true;
      state.updateUserProfileState.isError = false;
      state.updateUserProfileState.isSuccess = false;
      state.updateUserProfileState.message = "Updating profile...";
    },
    [updateUserProfile.fulfilled]: (state, action) => {
      state.updateUserProfileState.isLoading = false;
      state.updateUserProfileState.isError = false;
      state.updateUserProfileState.isSuccess = true;
      state.updateUserProfileState.message = action.payload.message;
      state.user = action.payload.updatedUser;
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user", JSON.stringify(action.payload.updatedUser));
    },
    [updateUserProfile.rejected]: (state, action) => {
      state.updateUserProfileState.isLoading = false;
      state.updateUserProfileState.isError = true;
      state.updateUserProfileState.isSuccess = false;
      state.updateUserProfileState.message = action.payload.message;
    },
    [sendEmailVerification.pending]: (state) => {
      state.sendEmailVerify.isLoading = true;
      state.sendEmailVerify.isError = false;
      state.sendEmailVerify.isSuccess = false;
      state.sendEmailVerify.message = "Sending an activation link...";
    },
    [sendEmailVerification.fulfilled]: (state, action) => {
      state.sendEmailVerify.isLoading = false;
      state.sendEmailVerify.isError = false;
      state.sendEmailVerify.isSuccess = true;
      state.sendEmailVerify.message = action.payload.message;
    },
    [sendEmailVerification.rejected]: (state, action) => {
      state.sendEmailVerify.isLoading = false;
      state.sendEmailVerify.isError = true;
      state.sendEmailVerify.isSuccess = false;
      state.sendEmailVerify.message = action.payload.message;
    },
    [emailVerify.pending]: (state) => {
      state.emailVerify.isLoading = true;
      state.emailVerify.isError = false;
      state.emailVerify.isSuccess = false;
      state.emailVerify.message = "Activating your account...";
    },
    [emailVerify.fulfilled]: (state, action) => {
      state.emailVerify.isLoading = false;
      state.emailVerify.isError = false;
      state.emailVerify.isSuccess = true;
      state.emailVerify.message = action.payload.message;
    },
    [emailVerify.rejected]: (state, action) => {
      state.emailVerify.isLoading = false;
      state.emailVerify.isError = true;
      state.emailVerify.isSuccess = false;
      state.emailVerify.message = action.payload.message;
    },
    [forgotPassword.pending]: (state) => {
      state.forgotPassword.isLoading = true;
      state.forgotPassword.isError = false;
      state.forgotPassword.isSuccess = false;
      state.forgotPassword.message = "Sending a reset password email...";
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.forgotPassword.isLoading = false;
      state.forgotPassword.isError = false;
      state.forgotPassword.isSuccess = true;
      state.forgotPassword.message = action.payload.message;
    },
    [forgotPassword.rejected]: (state, action) => {
      state.forgotPassword.isLoading = false;
      state.forgotPassword.isError = true;
      state.forgotPassword.isSuccess = false;
      state.forgotPassword.message = action.payload.message;
    },
    [resetPassword.pending]: (state) => {
      state.resetPassword.isLoading = true;
      state.resetPassword.isError = false;
      state.resetPassword.isSuccess = false;
      state.resetPassword.message = "Resetting Password...";
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.resetPassword.isLoading = false;
      state.resetPassword.isError = false;
      state.resetPassword.isSuccess = true;
      state.resetPassword.message = action.payload.message;
    },
    [resetPassword.rejected]: (state, action) => {
      state.resetPassword.isLoading = false;
      state.resetPassword.isError = true;
      state.resetPassword.isSuccess = false;
      state.resetPassword.message = action.payload.message;
    },
  },
});

export const {
  resetLogin,
  resetRegister,
  resetUpdateProfile,
  resetVerifyEmail,
} = authSlice.actions;

export default authSlice.reducer;
