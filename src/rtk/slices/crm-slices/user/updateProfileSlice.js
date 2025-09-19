import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance"; // Ensure axiosInstance is correctly set up

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ profileData, token }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/profile-update', profileData, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Sending token in Authorization header
                    'Content-Type': 'multipart/form-data', // Necessary for FormData
                },
            });
            return response.data;  // Return the updated data
        } catch (error) {
            if (error.response) {
                console.error('Profile Update API error:', error.response.data);
                return rejectWithValue(error.response.data);  // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);

const updateProfileSlice = createSlice({
    name: 'user',
    initialState: {
        userUpdated: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                // Handle successful profile update
                state.status = 'succeeded';
                // console.log('Profile updated successfully:',); // Removed console.log
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                console.error('Profile update failed:', action.payload);
            });
    },
});

export default updateProfileSlice.reducer;

