// src/slices/checkReferralSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';



// Async action to handle user registration
export const checkReferral = createAsyncThunk(
    'referral/checkReferral',
    async (referral, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/check-referral', referral);

            return response.data;
        } catch (error) {
            console.error("referral error", error.response.data);

            if (error.response && error.response.data) {
                const { message, errors } = error.response.data;
                return rejectWithValue({ message, errors });
            }
            return rejectWithValue({ message: 'An unexpected error occurred' });
        }
    }
);

const checkReferralSlice = createSlice({
    name: 'referral',
    initialState: {
        status: null,
        fullname: null,
        email: null,
        loading: false,
        errorMessage: '',
        fieldErrors: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkReferral.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
                state.fieldErrors = {};
            })
            .addCase(checkReferral.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload.status;
                state.fullname = action.payload.fullname;
                state.email = action.payload.email;
                state.errorMessage = '';
                state.fieldErrors = {};
            })
            .addCase(checkReferral.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload.message;
                state.fieldErrors = action.payload.errors || {};
            });
    },
});

export default checkReferralSlice.reducer;
