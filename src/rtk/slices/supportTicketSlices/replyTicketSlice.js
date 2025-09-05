import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1 } from "../../../utils/config";

// Async thunk for replying to a ticket
export const replyTicket = createAsyncThunk(
  "replyTicket/reply",
  async ({ ticketNum, ticketData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.post(
        `${apiBaseUrl1}/ticket/reply/${ticketNum}`,
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data; // Assuming response contains success message
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Initial state
const initialState = {
  replyStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Ticket reply slice
const replyTicketSlice = createSlice({
  name: "replyTicket",
  initialState,
  reducers: {
    resetReplyStatus: (state) => {
      state.replyStatus = "idle"; // Reset replyStatus after refresh
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(replyTicket.pending, (state) => {
        state.replyStatus = "loading";
        state.error = null;
      })
      .addCase(replyTicket.fulfilled, (state) => {
        state.replyStatus = "succeeded";
      })
      .addCase(replyTicket.rejected, (state, action) => {
        state.replyStatus = "failed";
        state.error = action.payload; // Store error message
      });
  },
});

// Export actions and reducer
export const { resetReplyStatus } = replyTicketSlice.actions;
export default replyTicketSlice.reducer;
