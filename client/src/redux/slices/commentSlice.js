import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  comments: [],
  getTopicCommentsState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: null,
  },
  topHelpers: [],
  herlpersIsLoading: false,
  votingIsLoading: false,
  deleteCommentLoading: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
};

export const getTopicComments = createAsyncThunk(
  "comment/getTopicComments",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/comments/${id}`, id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/comments/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ id, comment, parentComment }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/comments/`, {
        id,
        comment,
        parentComment,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleUpvoteComment = createAsyncThunk(
  "comment/toggleUpvoteComment",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/comments/${id}/upvote`, id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleDownvoteComment = createAsyncThunk(
  "comment/toggleDownvoteComment",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/comments/${id}/downvote`, id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getTopHelpers = createAsyncThunk(
  "comment/getTopHelpers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/comments/helpers`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: {
    [getTopicComments.pending]: (state) => {
      state.getTopicCommentsState.isLoading = true;
    },
    [getTopicComments.fulfilled]: (state, action) => {
      state.getTopicCommentsState.isLoading = false;
      state.comments = action.payload.comments;
    },
    [getTopicComments.rejected]: (state) => {
      state.getTopicCommentsState.isLoading = false;
    },
    [addComment.pending]: (state) => {
      state.isLoading = true;
    },
    [addComment.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.comments.push(action.payload.comment);
    },
    [addComment.rejected]: (state) => {
      state.isLoading = false;
    },
    [toggleUpvoteComment.pending]: (state) => {
      state.votingIsLoading = true;
    },
    [toggleUpvoteComment.fulfilled]: (state, action) => {
      state.votingIsLoading = false;
      state.comments.map((comment) => {
        if (comment._id === action.payload.commentId) {
          if (comment.upvotes.includes(action.payload.username)) {
            comment.upvotes = comment.upvotes.filter(
              (id) => id !== action.payload.username
            );
          } else {
            comment.upvotes.push(action.payload.username);
            comment.downvotes = comment.downvotes.filter(
              (id) => id !== action.payload.username
            );
          }
          return comment;
        }
        return comment;
      });
    },
    [toggleUpvoteComment.rejected]: (state) => {
      state.votingIsLoading = false;
    },
    [toggleDownvoteComment.pending]: (state) => {
      state.votingIsLoading = true;
    },
    [toggleDownvoteComment.fulfilled]: (state, action) => {
      state.votingIsLoading = false;
      state.comments.map((comment) => {
        if (comment._id === action.payload.commentId) {
          if (comment.downvotes.includes(action.payload.username)) {
            comment.downvotes = comment.downvotes.filter(
              (id) => id !== action.payload.username
            );
          } else {
            comment.downvotes.push(action.payload.username);
            comment.upvotes = comment.upvotes.filter(
              (id) => id !== action.payload.username
            );
          }
          return comment;
        }
        return comment;
      });
    },
    [toggleDownvoteComment.rejected]: (state) => {
      state.votingIsLoading = false;
    },
    [deleteComment.pending]: (state) => {
      state.deleteCommentLoading = true;
    },
    [deleteComment.fulfilled]: (state, action) => {
      state.deleteCommentLoading = false;
      state.comments = state.comments.filter(
        (comment) => !action.payload.deletedComments.includes(comment._id)
      );
    },
    [deleteComment.rejected]: (state) => {
      state.deleteCommentLoading = false;
    },
    [getTopHelpers.pending]: (state) => {
      state.herlpersIsLoading = true;
    },
    [getTopHelpers.fulfilled]: (state, action) => {
      state.herlpersIsLoading = false;
      state.topHelpers = action.payload;
    },
    [getTopHelpers.rejected]: (state) => {
      state.herlpersIsLoading = false;
    },
  },
});

export default commentSlice.reducer;
