import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl, apiBaseUrl1, token } from '../../../utils/config';

// Async Thunk for fetching binary trade history
export const fetchBinaryTradeHistory = createAsyncThunk(
    'history/fetchBinaryTradeHistory',
    async ({ startDate, token }, { rejectWithValue }) => {  // Ensure token is passed

        try {
            const response = await axios.post(
                `${apiBaseUrl1}/trade/history`,
                { startDate }, // Request body should contain only data
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Corrected header placement
                    },
                }
            );

            const res = response.data;

            if (res && res.data) {
                return {
                    binaryTrades: res.data,
                    pendingTrades: res.pending_orders // Assuming positions are in `data`
                };
            } else {
                return rejectWithValue('Invalid response structure from the API');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// Initial state
const initialState = {
    binaryTrades: [],
    pendingTrades: [],
    loading: false,
    error: null,
};

// Create Redux slice
const binaryTradeHistorySlice = createSlice({
    name: 'binaryTradeHistory',
    initialState,
    reducers: {
        removePendingTrade: (state, action) => {
            state.pendingTrades = state.pendingTrades.filter(trade => trade.id !== action.payload);
        }
    }, // No synchronous reducers for now
    extraReducers: (builder) => {
        builder
            .addCase(fetchBinaryTradeHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBinaryTradeHistory.fulfilled, (state, action) => {

                state.loading = false;
                state.binaryTrades = action.payload.binaryTrades; // Store trade history
                state.pendingTrades = action.payload.pendingTrades
            })
            .addCase(fetchBinaryTradeHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch trade history';
            });
    }
});

// Export actions (if needed) and reducer
export const { removePendingTrade } = binaryTradeHistorySlice.actions;
export default binaryTradeHistorySlice.reducer;
