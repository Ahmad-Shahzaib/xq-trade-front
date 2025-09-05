// src/rtk/slices/trade/newTradingAccountSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance";

// Async thunk for submitting the new trading account
export const submitNewTradingAccount = createAsyncThunk(
    'trade/newTradingAccount',
    async ({ newTradeAccountData, token }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/trade-accounts-create', newTradeAccountData, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Sending token in Authorization header
                    'Content-Type': 'multipart/form-data', // Necessary for FormData
                },
            });
            return response.data;  // Return the updated data
        } catch (error) {
            if (error.response) {
                console.error('Submit Trading Account API error:', error.response.data);
                return rejectWithValue(error.response.data);
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);

const newTradingAccountSlice = createSlice({
    name: 'newTradingAccount',
    initialState: {
        loading: false,
        success: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitNewTradingAccount.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(submitNewTradingAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload;
            })
            .addCase(submitNewTradingAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default newTradingAccountSlice.reducer;
