import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance";



export const withdrawalList = createAsyncThunk(
    'withdrawal/withdrawalList',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/withdraw-history', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const res = response.data
            const data = res.data
            
            return data;
        } catch (error) {
            if (error.response) {
                console.error('Get withdrawal List API error:', error.response.data);
                return rejectWithValue(error.response.data); // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);


const withdrawalListSlice = createSlice({
    name: 'withdrawalList',
    initialState: {
        withdrawalList: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(withdrawalList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(withdrawalList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.withdrawalList = action.payload;
            })
            .addCase(withdrawalList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Set the error message when the request fails
            });
    }
});

export default withdrawalListSlice.reducer;