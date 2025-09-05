import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance";

export const depositList = createAsyncThunk(
    'deposit/depositList',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/deposit-list', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Get Deposit List API error:', error.response.data);
                return rejectWithValue(error.response.data); // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);

const depositListSlice = createSlice({
    name: 'depositList',
    initialState: {
        depositList: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(depositList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(depositList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.depositList = action.payload;
            })
            .addCase(depositList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Set the error message when the request fails
            });
    }
});

export default depositListSlice.reducer;
