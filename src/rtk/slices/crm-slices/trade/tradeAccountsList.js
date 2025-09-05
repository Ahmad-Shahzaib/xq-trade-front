import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance";

export const tradeAccountsList = createAsyncThunk(
    'trade/tradeAccountsList',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/trade-accounts-list', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Get Trade Accounts List API error:', error.response.data);
                return rejectWithValue(error.response.data); // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
)

const tradeAccountsListSlice = createSlice({
    name: 'tradeAccountsList',
    initialState: {
        tradeAccount: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(tradeAccountsList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(tradeAccountsList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tradeAccount = action.payload;
            })
            .addCase(tradeAccountsList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Set the error message when the request fails
            });
    }
});

export default tradeAccountsListSlice.reducer;