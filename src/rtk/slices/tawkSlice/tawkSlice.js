import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1 } from "../../../utils/config"; // Adjust API base URL

// ✅ Async Thunk to fetch Tawk API data
export const fetchTawkData = createAsyncThunk(
  "tawk/fetchTawkData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get token from localStorage

      const response = await axios.get(`${apiBaseUrl1}/tawk`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token in headers
        },
      });

      return response.data; // ✅ Return full response (we extract `app_key` in component)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Initial state
const initialState = {
  tawkData: null,
  loading: false,
  error: null,
};

// ✅ Redux Slice
const tawkSlice = createSlice({
  name: "tawk",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTawkData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTawkData.fulfilled, (state, action) => {
        state.loading = false;
        state.tawkData = action.payload; // ✅ Store fetched Tawk data
      })
      .addCase(fetchTawkData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch Tawk data";
      });
  },
});

// ✅ Export reducer
export default tawkSlice.reducer;
