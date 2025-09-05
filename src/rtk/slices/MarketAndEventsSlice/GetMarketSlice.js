import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1 } from "../../../utils/config"; // Adjust path as needed

// **Thunk to fetch market data with token**
export const fetchMarkets = createAsyncThunk(
  "markets/fetchMarkets",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const response = await axios.get(
        `${apiBaseUrl1}/markets`, 
        
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        }
      );
      return response.data; // Return market data array
    } catch (error) {
      return rejectWithValue(error.response?.message || "Error fetching markets");
    }
  }
);

// **Market Slice**
const marketSlice = createSlice({
  name: "markets",
  initialState: {
    markets: [],
    marketImages:[],
    isLoading: false,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      // **Handle fetching markets**
      .addCase(fetchMarkets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchMarkets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.markets = action.payload.data;
        state.marketImages=action.payload.marketImages;
      })
      .addCase(fetchMarkets.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default marketSlice.reducer;
