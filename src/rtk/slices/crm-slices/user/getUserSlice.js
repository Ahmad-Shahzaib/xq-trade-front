import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance"; 

// Async thunk to get user information from the backend
export const getUser = createAsyncThunk(
    'user/getUser',
    async (token, { rejectWithValue }) => {
        try {
            // Send a GET request to fetch user details
            const response = await axiosInstance.get('/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send token in Authorization header
                }
            });

            return response.data.user;  // Return the fetched user data
        } catch (error) {
            if (error.response) {
                console.error('Get User API error:', error.response.data);
                return rejectWithValue(error.response.data);  // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);

// Create a slice for managing user state
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        registeredDays:null,
        totalTrades:null,
        username:'',
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;  // Set the user data when the request is successful
                state.registeredDays = action.payload.registered_days
                state.totalTrades = action.payload.total_trades
                state.username = action.payload.username
                
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;  // Set the error message when the request fails
            });
    },
});

export default userSlice.reducer;
