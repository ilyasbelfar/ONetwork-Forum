import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import topicSlice from './slices/topicSlice';
import commentSlice from './slices/commentSlice';
import profileSlice from './slices/profileSlice';

const store = configureStore({
    reducer: {
      auth: authReducer,
      topic: topicSlice,
      comment: commentSlice,
      profile: profileSlice,
    },
  });  

export default store;