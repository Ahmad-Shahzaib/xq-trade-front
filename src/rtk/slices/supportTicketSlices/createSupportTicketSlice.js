import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import { apiBaseUrl1 } from "../../../utils/config";


export const createSupportTicket = createAsyncThunk(
    "supportTicket/create",
    async (ticketData, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const response = await axios.post(`${apiBaseUrl1}/ticket/create`, ticketData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
    }
  );


  const supportTicketSlice = createSlice({
    name: "supportTicket",
    initialState: {
      loading: false,
      error: null,
      success: false,
    },
    reducers: {
      resetSupportTicketState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(createSupportTicket.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase(createSupportTicket.fulfilled, (state) => {
          state.loading = false;
          state.success = true;
        })
        .addCase(createSupportTicket.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.success = false;
        });
    },
  });
  
  export const { resetSupportTicketState } = supportTicketSlice.actions;
  export default supportTicketSlice.reducer;
  