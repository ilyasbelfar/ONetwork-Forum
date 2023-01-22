import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  topics: [],
  topic: {},
  topContributors: [],
  spaces: [],
  getSpacesLoading: false,
  searchQuery: "",
  sortOption: "latest",
  getAllTopicsIsLoading: false,
  getTopicIsLoading: false,
  votingIsLoading: false,
  topContributorsIsLoading: false,
  addTopic: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    newTopicURL: null,
    message: null,
  },
  deleteTopicIsLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
};

export const getAllTopics = createAsyncThunk(
  "topic/getAllTopics",
  async ({ sortOption, searchQuery }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/topics", {
        params: { sort: sortOption, search: searchQuery },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getTopic = createAsyncThunk(
  "topic/getTopic",
  async ({ id, slug }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/topics/${id}/${slug}`, {
        id,
        slug,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addTopic = createAsyncThunk(
  "topic/addTopic",
  async (
    { title, content, selectedSpace, selectedTags },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post("/api/topics", {
        title,
        content,
        selectedSpace,
        selectedTags,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteTopic = createAsyncThunk(
  "topic/deleteTopic",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/topics/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleUpvoteTopic = createAsyncThunk(
  "topic/toggleUpvoteTopic",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/topics/${id}/upvote`, id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleDownvoteTopic = createAsyncThunk(
  "topic/toggleDownvoteTopic",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/topics/${id}/downvote`, id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getTopContributors = createAsyncThunk(
  "topic/getTopContributors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/topics/contributors`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getSpaces = createAsyncThunk(
  "topic/getSpaces",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/topics/spaces`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    resetTopics: (state) => {
      state.topics = [];
      state.topic = {};
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = null;
    },
    resetNewTopic: (state) => {
      state.addTopic = { ...initialState.addTopic };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
  },
  extraReducers: {
    [getAllTopics.pending]: (state) => {
      state.getAllTopicsIsLoading = true;
    },
    [getAllTopics.fulfilled]: (state, action) => {
      state.getAllTopicsIsLoading = false;
      state.topics = action.payload;
    },
    [getAllTopics.rejected]: (state) => {
      state.getAllTopicsIsLoading = false;
    },
    [getTopic.pending]: (state) => {
      state.getTopicIsLoading = true;
    },
    [getTopic.fulfilled]: (state, action) => {
      state.getTopicIsLoading = false;
      state.topic = action.payload;
    },
    [getTopic.rejected]: (state) => {
      state.getTopicIsLoading = false;
    },
    [addTopic.pending]: (state) => {
      state.addTopic.isLoading = true;
      state.addTopic.isSuccess = false;
      state.addTopic.isError = false;
      state.addTopic.message = "Adding new topic...";
    },
    [addTopic.fulfilled]: (state, action) => {
      state.addTopic.isLoading = false;
      state.addTopic.isSuccess = true;
      state.addTopic.isError = false;
      state.topics.push(action.payload.topic);
      state.addTopic.message = action.payload.message;
      state.addTopic.newTopicURL = `/topics/${action.payload.topic.TopicID}/${action.payload.topic.slug}`;
    },
    [addTopic.rejected]: (state, action) => {
      state.addTopic.isLoading = false;
      state.addTopic.isSuccess = false;
      state.addTopic.isError = true;
      state.addTopic.message = action.payload.message;
    },
    [toggleUpvoteTopic.pending]: (state) => {
      state.votingIsLoading = true;
    },
    [toggleUpvoteTopic.fulfilled]: (state, action) => {
      state.votingIsLoading = false;

      if (Object.keys(state.topic).length > 0) {
        if (state.topic._id === action.payload.topicId) {
          if (state.topic.upvotes.includes(action.payload.username)) {
            state.topic.upvotes = state.topic.upvotes.filter(
              (id) => id !== action.payload.username
            );
          } else {
            state.topic.upvotes.push(action.payload.username);
            state.topic.downvotes = state.topic.downvotes.filter(
              (id) => id !== action.payload.username
            );
          }
        }
      }

      state.topics.map((topic) => {
        if (topic._id === action.payload.topicId) {
          if (topic.upvotes.includes(action.payload.username)) {
            topic.upvotes = topic.upvotes.filter(
              (id) => id !== action.payload.username
            );
          } else {
            topic.upvotes.push(action.payload.username);
            topic.downvotes = topic.downvotes.filter(
              (id) => id !== action.payload.username
            );
          }
          return topic;
        }
        return topic;
      });
    },
    [toggleUpvoteTopic.rejected]: (state) => {
      state.votingIsLoading = false;
    },
    [toggleDownvoteTopic.pending]: (state) => {
      state.votingIsLoading = true;
    },
    [toggleDownvoteTopic.fulfilled]: (state, action) => {
      state.votingIsLoading = false;

      if (Object.keys(state.topic).length > 0) {
        if (state.topic._id === action.payload.topicId) {
          if (state.topic.downvotes.includes(action.payload.username)) {
            state.topic.downvotes = state.topic.downvotes.filter(
              (id) => id !== action.payload.username
            );
          } else {
            state.topic.downvotes.push(action.payload.username);
            state.topic.upvotes = state.topic.upvotes.filter(
              (id) => id !== action.payload.username
            );
          }
        }
      }

      state.topics.map((topic) => {
        if (topic._id === action.payload.topicId) {
          if (topic.downvotes.includes(action.payload.username)) {
            topic.downvotes = topic.downvotes.filter(
              (id) => id !== action.payload.username
            );
          } else {
            topic.downvotes.push(action.payload.username);
            topic.upvotes = topic.upvotes.filter(
              (id) => id !== action.payload.username
            );
          }
          return topic;
        }
        return topic;
      });
    },
    [toggleDownvoteTopic.rejected]: (state) => {
      state.votingIsLoading = false;
    },
    [deleteTopic.pending]: (state) => {
      state.deleteTopicIsLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "Deleting topic...";
    },
    [deleteTopic.fulfilled]: (state, action) => {
      state.deleteTopicIsLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.topic = {};
      state.topics = state.topics.filter(
        (t) => t._id !== action.payload.topicId
      );
      state.message = action.payload.message;
    },
    [deleteTopic.rejected]: (state, action) => {
      state.deleteTopicIsLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload.message;
    },
    [getTopContributors.pending]: (state) => {
      state.topContributorsIsLoading = true;
    },
    [getTopContributors.fulfilled]: (state, action) => {
      state.topContributorsIsLoading = false;
      state.topContributors = action.payload;
    },
    [getTopContributors.rejected]: (state) => {
      state.topContributorsIsLoading = false;
    },
    [getSpaces.pending]: (state) => {
      state.getSpacesLoading = true;
    },
    [getSpaces.fulfilled]: (state, action) => {
      state.getSpacesLoading = false;
      state.spaces = action.payload;
    },
    [getSpaces.rejected]: (state) => {
      state.getSpacesLoading = false;
    },
  },
});

export const { resetTopics, resetNewTopic, setSearchQuery, setSortOption } =
  topicSlice.actions;

export default topicSlice.reducer;
