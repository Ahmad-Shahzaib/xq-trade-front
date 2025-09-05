import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1, apiKey } from '../../../utils/config';

// Async thunk to fetch symbols
export const fetchSymbols = createAsyncThunk(
  "symbols/fetchSymbols",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiBaseUrl1}/all-symbols-string`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // Extracting 'data' array
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching symbols");
    }
  }
);

const symbolsSlice = createSlice({
  name: "symbols",
  initialState: {
    symbols: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSymbols.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSymbols.fulfilled, (state, action) => {
        state.loading = false;
        state.symbols = action.payload;
      })
      .addCase(fetchSymbols.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default symbolsSlice.reducer;
