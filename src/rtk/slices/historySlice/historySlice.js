// historySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl, apiKey } from '../../../utils/config';

export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async ({ api_key, account }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/history`, {
        api_key,
        account,
      });

      const res = response.data
      const data = res.data
      // return data; // Return only the data part
      // Extract history positions and summary
      if (data) {
        return {
          
          historyPositions: data, // Assuming positions are in `data`
          // summary: response.summary // Assuming summary is in `summary`
        };
      } else {
        return rejectWithValue('Invalid response structure from the API');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState: {
    historyPositions: [],
    summary: null, // Add a summary field
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historyPositions = action.payload.historyPositions;
        state.summary = action.payload.summary; // Set the summary
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch history';
      });
  },
});

export const selectHistory = (state) => state.history.historyPositions;
// export const selectSummary = (state) => state.history.summary; // Selector for summary
export const selectHistoryLoading = (state) => state.history.loading;
export const selectHistoryError = (state) => state.history.error;

export default historySlice.reducer;
