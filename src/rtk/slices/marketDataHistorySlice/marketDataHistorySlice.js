import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an async thunk to fetch market data
export const fetchMarketDataHistory = createAsyncThunk(
  'marketDataHistory/fetchMarketDataHistory',
  async ({symbol,timeframe,bars}, { rejectWithValue }) => {

      let sym = symbol? symbol : 'BTCUSD.ex1'
    try {
      // console.log(`selected symbol is ${sym} and timeframe is ${timeframe} for bars ${bars}`);
      // https://apicon.brokercheap.com/newapp/ohlc/?symbol=EURUSD&timeframe=M1&bars=100 new api 
      // `https://5csb.w.time4vps.cloud:8005/ohlc/?symbol=${sym}&timeframe=${timeframe}&bars=${bars}`
      const response = await axios.get(
        `https://apicon.brokercheap.com:8040/newapp/ohlc/?symbol=${sym}&timeframe=${timeframe}&bars=${bars}`
      );
      
      return response?.data; // Make sure to return data from the response
    } catch (error) {
      // If there's an error, reject the value with the error message
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create the Redux slice
const marketDataHistorySlice = createSlice({
  name: 'marketDataHistory',
  initialState: {
    data: [], // Initialize the data array
    status: 'idle', // Initial status is idle
    error: null, // No error initially
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When the fetch is in progress
      .addCase(fetchMarketDataHistory.pending, (state) => {
        state.status = 'loading'; // Set status to 'loading'
      })
      // When the fetch is successful
      .addCase(fetchMarketDataHistory.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to 'succeeded'
        state.data = action.payload; // Store the fetched data in the state
      })
      // When the fetch fails
      .addCase(fetchMarketDataHistory.rejected, (state, action) => {
        state.status = 'failed'; // Set status to 'failed'
        state.error = action.payload || action.error.message; // Store the error message
      });
  },
});

export default marketDataHistorySlice.reducer;