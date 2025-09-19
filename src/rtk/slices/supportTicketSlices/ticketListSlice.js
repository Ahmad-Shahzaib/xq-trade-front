import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1 } from "../../../utils/config";

// Async thunk to fetch tickets
export const fetchTickets = createAsyncThunk(
    "tickets/fetchTickets",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
  
        const response = await axios.get(`${apiBaseUrl1}/ticket`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in Authorization header
          },
        });
        const res = response?.data
  
        // console.log("res tickets", res); // Removed console.log
        return res?.data; // Returning only the tickets array
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch tickets");
      }
    }
  );
  
  
  const ticketListSlice = createSlice({
    name: "tickets",
    initialState: {
      tickets: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchTickets.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTickets.fulfilled, (state, action) => {
          state.loading = false;
          state.tickets = action.payload;
        })
        .addCase(fetchTickets.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export default ticketListSlice.reducer;