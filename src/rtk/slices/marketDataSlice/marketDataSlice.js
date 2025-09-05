import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an async thunk to fetch market data
export const fetchMarketData = createAsyncThunk(
  'marketData/fetchMarketData',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch the OHLC data from the Binance API
      const response = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=5000`
      );
      
      return response?.data; // Make sure to return data from the response
    } catch (error) {
      // If there's an error, reject the value with the error message
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create the Redux slice
const marketDataSlice = createSlice({
  name: 'marketData',
  initialState: {
    data: [], // Initialize the data array
    status: 'idle', // Initial status is idle
    error: null, // No error initially
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When the fetch is in progress
      .addCase(fetchMarketData.pending, (state) => {
        state.status = 'loading'; // Set status to 'loading'
      })
      // When the fetch is successful
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to 'succeeded'
        state.data = action.payload; // Store the fetched data in the state
      })
      // When the fetch fails
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.status = 'failed'; // Set status to 'failed'
        state.error = action.payload || action.error.message; // Store the error message
      });
  },
});

export default marketDataSlice.reducer;
