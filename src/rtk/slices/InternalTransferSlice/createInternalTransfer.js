import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl1 } from '../../../utils/config';
import axiosInstance from '../../../api/axiosInstance';

// Async thunk for making the API request
export const createInternalTransfer =createAsyncThunk(
    'user/updateProfile',
    async ({ transferData, token }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/internal-transfer/create', transferData, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Sending token in Authorization header
                    'Content-Type': 'multipart/form-data', // Necessary for FormData
                },
            });
            return response.data;  // Return the updated data
        } catch (error) {
            if (error.response) {
                console.error('transfer API error:', error.response.data);
                return rejectWithValue(error.response.data);  // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);

const internalTransferSlice = createSlice({
    name: 'internalTransfer',
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetTransferState: (state) => {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createInternalTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createInternalTransfer.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createInternalTransfer.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'object' ? action.payload.message || "An error occurred" : action.payload;
            });
    },
});

export const { resetTransferState } = internalTransferSlice.actions;
export default internalTransferSlice.reducer;
