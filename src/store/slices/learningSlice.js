import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LEARNING_LIST_KEY = '@learning_list';

export const LEARNING_STATUS = {
  SAVED: 'Saved',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const loadLearning = createAsyncThunk(
  'learning/loadLearning',
  async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(LEARNING_LIST_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      return [];
    }
  }
);

const learningSlice = createSlice({
  name: 'learning',
  initialState: {
    items: [],
    status: 'idle',
  },
  reducers: {
    toggleLearning: (state, action) => {
      const course = action.payload;
      const index = state.items.findIndex(item => item.key === course.key);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({ ...course, status: LEARNING_STATUS.SAVED, addedAt: new Date().toISOString() });
      }
      AsyncStorage.setItem(LEARNING_LIST_KEY, JSON.stringify(state.items));
    },
    updateLearningStatus: (state, action) => {
      const { courseKey, status } = action.payload;
      const index = state.items.findIndex(item => item.key === courseKey);
      if (index >= 0) {
        state.items[index].status = status;
        state.items[index].updatedAt = new Date().toISOString();
        AsyncStorage.setItem(LEARNING_LIST_KEY, JSON.stringify(state.items));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLearning.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      });
  },
});

export const { toggleLearning, updateLearningStatus } = learningSlice.actions;
export default learningSlice.reducer;
