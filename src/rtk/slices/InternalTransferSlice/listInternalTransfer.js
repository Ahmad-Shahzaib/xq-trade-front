import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1 } from '../../../utils/config';

// Async thunk to fetch internal transfer list
export const internalTransferList = createAsyncThunk(
  "internalTransferList/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiBaseUrl1}/internal-transfer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = response?.data?.data
      return res.data; // Extracting 'data' array
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching internal transfer list");
    }
  }
);

const internalTransferListSlice = createSlice({
  name: "internalTransferList",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(internalTransferList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(internalTransferList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(internalTransferList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default internalTransferListSlice.reducer;
