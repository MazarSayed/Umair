import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEWS_KEY = '@course_reviews';

export const loadReviews = createAsyncThunk(
  'reviews/loadReviews',
  async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(REVIEWS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
      return {};
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: {}, // courseKey -> { text, rating, updatedAt }
    status: 'idle',
  },
  reducers: {
    addOrUpdateReview: (state, action) => {
      const { courseKey, text, rating } = action.payload;
      state.items[courseKey] = {
        text,
        rating,
        updatedAt: new Date().toISOString(),
      };
      AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(state.items));
    },
    deleteReview: (state, action) => {
      const courseKey = action.payload;
      delete state.items[courseKey];
      AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadReviews.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      });
  },
});

export const { addOrUpdateReview, deleteReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
