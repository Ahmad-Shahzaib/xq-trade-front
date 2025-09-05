import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance";

export const myReferrals = createAsyncThunk(
    'myReferrals/getMyReferrals',
    async ({ token, level }, { rejectWithValue }) => {
        try {
            // Send a GET request to fetch user details
            const response = await axiosInstance.get(`/referrals?level=${level}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                },
            });


            return response.data; // Return the fetched user data
        } catch (error) {
            if (error.response) {
                console.error('Get myReferrals API error:', error.response.data);
                return rejectWithValue(error.response.data); // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);


const myReferralsSlice = createSlice({
    name: 'myReferrals',
    initialState: {
        referrals: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(myReferrals.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(myReferrals.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.referrals = action.payload.logs?.data || [];
            })
            .addCase(myReferrals.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;  // Set the error message when the request fails
            });
    },
});

export default myReferralsSlice.reducer;