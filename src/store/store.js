import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import learningReducer from './slices/learningSlice';
import historyReducer from './slices/historySlice';
import reviewsReducer from './slices/reviewsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    learning: learningReducer,
    history: historyReducer,
    reviews: reviewsReducer,
  },
});
