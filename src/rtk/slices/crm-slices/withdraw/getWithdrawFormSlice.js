import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance"; 

export const createWithdraw = createAsyncThunk(
    'withdraw/createWithdraw',
    async (token, { rejectWithValue }) => {
        try {
            // Send a GET request to fetch withdraw creation data
            const response = await axiosInstance.get('/withdraw/create', {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send token in Authorization header
                }
            });
            
            return response.data;  // Return the fetched data
        } catch (error) {
            if (error.response) {
                console.error('Withdraw API error:', error.response.data);
                return rejectWithValue(error.response.data);  // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);

const initialState = {
    withdrawMethods: [],
    tradeAccounts: [],
    status: 'idle', // idle | pending | succeeded | failed
    error: null
};

const withdrawSlice = createSlice({
    name: 'withdraw',
    initialState,
    reducers: {
        // You can add reducers here for other synchronous state updates
    },
    extraReducers: (builder) => {
        builder
            .addCase(createWithdraw.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(createWithdraw.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.withdrawMethods = action.payload.withdrawMethods || [];
                state.tradeAccounts = action.payload.tradeAccounts || [];
            })
            .addCase(createWithdraw.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Something went wrong';
            });
    }
});

export default withdrawSlice.reducer;
