import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1 } from "../../../utils/config"; // Adjust path as needed

// **Thunk to fetch market data with token**
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const response = await axios.get(
        `${apiBaseUrl1}/events`, 
        
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
        }
      );
      return response.data.data; // Return market data array
    } catch (error) {
      return rejectWithValue(error.response?.message || "Error fetching events");
    }
  }
);

// **Market Slice**
const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    isLoading: false,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      // **Handle fetching events**
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default eventSlice.reducer;
