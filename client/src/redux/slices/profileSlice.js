import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  userProfile: {},
  userComments: [],
  userFollowing: [],
  userFollowers: [],
  profileIsLoading: false,
  commentsIsLoading: false,
  followIsLoading: false,
};

export const getUserProfile = createAsyncThunk(
  "profile/getUserProfile",
  async (username) => {
    try {
      const { data } = await axios.get(`/api/user/${username}`, username);
      return data;
    } catch (err) {
      console.log(err.message);
    }
  }
);

export const getUserComments = createAsyncThunk(
  "profile/getUserComments",
  async (username) => {
    try {
      const { data } = await axios.get(
        `/api/user/${username}/comments`,
        username
      );
      return data;
    } catch (err) {
      console.log(err.message);
    }
  }
);

export const getUserFollowing = createAsyncThunk(
  "profile/getUserFollowing",
  async (username) => {
    try {
      const { data } = await axios.get(
        `/api/user/${username}/following`,
        username
      );
      return data;
    } catch (err) {
      console.log(err.message);
    }
  }
);

export const getUserFollowers = createAsyncThunk(
  "profile/getUserFollowers",
  async (username) => {
    try {
      const { data } = await axios.get(
        `/api/user/${username}/followers`,
        username
      );
      return data;
    } catch (err) {
      console.log(err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetUserProfile: (state) => {
      state.userProfile = {};
      state.isLoading = false;
    },
    resetUserComments: (state) => {
      state.userComments = [];
      state.isLoading = false;
    },
  },
  extraReducers: {
    [getUserProfile.pending]: (state) => {
      state.profileIsLoading = true;
    },
    [getUserProfile.fulfilled]: (state, action) => {
      state.profileIsLoading = false;
      state.userProfile = action.payload;
    },
    [getUserProfile.rejected]: (state) => {
      state.profileIsLoading = false;
    },
    [getUserComments.pending]: (state) => {
      state.commentsIsLoading = true;
    },
    [getUserComments.fulfilled]: (state, action) => {
      state.commentsIsLoading = false;
      state.userComments = action.payload;
    },
    [getUserComments.rejected]: (state) => {
      state.commentsIsLoading = false;
    },
    [getUserFollowing.pending]: (state) => {
      state.followIsLoading = true;
    },
    [getUserFollowing.fulfilled]: (state, action) => {
      state.followIsLoading = false;
      state.userFollowing = action.payload;
    },
    [getUserFollowing.rejected]: (state) => {
      state.followIsLoading = false;
    },
    [getUserFollowers.pending]: (state) => {
      state.followIsLoading = true;
    },
    [getUserFollowers.fulfilled]: (state, action) => {
      state.followIsLoading = false;
      state.userFollowers = action.payload;
    },
    [getUserFollowers.rejected]: (state) => {
      state.followIsLoading = false;
    },
  },
});

export const { resetUserProfile, resetUserComments } = profileSlice.actions;

export default profileSlice.reducer;
