import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance";


export const getTradingAccountList = createAsyncThunk(
    'tradingAccountList/getTradingAccountList',
    async (token, { rejectWithValue }) => {
        try {
            // Send a GET request to fetch user details
            const response = await axiosInstance.get('/trade-accounts-list', {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send token in Authorization header
                }
            });
            return response.data;  // Return the fetched user data
        } catch (error) {
            if (error.response) {
                console.error('getTradingAccountList API error:', error.response.data);
                return rejectWithValue(error.response.data);  // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
)




const tradingAccountListSlice = createSlice({
    name: 'tradingAccountList',
    initialState: {
        tradingAccounts: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTradingAccountList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTradingAccountList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tradingAccounts = action.payload;  // Set the user data when the request is successful
            })
            .addCase(getTradingAccountList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;  // Set the error message when the request fails
            });
    },
});

export default tradingAccountListSlice.reducer;
