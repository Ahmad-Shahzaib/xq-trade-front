import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1 } from '../../../utils/config';

// Async thunk to fetch IB status
export const fetchIBStatus = createAsyncThunk(
    "IB/fetchIBStatus",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiBaseUrl1}/ib-status`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data; // Returning full response for status & user
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching IB status");
        }
    }
);


// **Thunk to apply for IB**
export const applyForIB = createAsyncThunk(
    "IB/applyForIB",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${apiBaseUrl1}/apply-for-ib`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return true; // Return success flag
        } catch (error) {
            return rejectWithValue(error.response?.message || "Error applying for IB");
        }
    }
);

// Initial state
const initialState = {
    ibData: null,
    user: null,
    link: "",
    status: null,
    isLoading: false,
    isError: null,
    successMessage: null,
};

// IB Status slice
const ibStatusSlice = createSlice({
    name: "IB",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.successMessage = null; // Clear success message
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIBStatus.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })
            .addCase(fetchIBStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ibData = action.payload.data; // Stores the "data" object
                state.user = action.payload.user;   // Stores the "user" field
                state.link = action.payload?.link || ""; // Stores IB link
                state.status = action.payload.data?.status || null; // Stores IB status
            })
            .addCase(fetchIBStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
            })

            // **Handle applying for IB**
            .addCase(applyForIB.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(applyForIB.fulfilled, (state) => {
                state.isLoading = false;
                state.status = 1; // Update status after applying
                state.successMessage = "Successfully applied for IB!";
            })
            .addCase(applyForIB.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});


export const { clearMessage } = ibStatusSlice.actions;
export default ibStatusSlice.reducer;
