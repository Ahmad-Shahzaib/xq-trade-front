import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1 } from "../../../utils/config";

export const fetchTicketDetails = createAsyncThunk(
    "ticketShow/fetchTicketDetails",
    async (ticketNumber, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiBaseUrl1}/ticket-show/${ticketNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token in Authorization header
                },
            });

            const responseData = response.data
            const data = responseData?.data
            console.log('ticket details', data);

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching ticket details");
        }
    }
);
export const fetchTicketMessages = createAsyncThunk(
    "ticketShow/fetchTicketMessages",
    async (ticketNumber, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiBaseUrl1}/ticket-show/${ticketNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.data.messages; // ✅ Return only messages array
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching messages");
        }
    }
);

const ticketShowSlice = createSlice({
    name: "ticketShow",
    initialState: {
        ticket: null,
        messages: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketDetails.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTicketDetails.fulfilled, (state, action) => {
                state.status = "succeeded";
                console.log('action payload', action.payload);

                state.ticket = action.payload?.ticket || null; // Ensure ticket is assigned safely
                state.messages = action.payload?.messages || []; // Ensure messages array exists
            })
            .addCase(fetchTicketDetails.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchTicketMessages.fulfilled, (state, action) => {
                state.messages = action.payload; // ✅ Update only messages
            });
    },
});

export default ticketShowSlice.reducer;
