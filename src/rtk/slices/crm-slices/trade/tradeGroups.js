import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance";

export const tradeGroups = createAsyncThunk(
    'trade/tradeGroups',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/trade-groups', {
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

const tradeGroupsSlice = createSlice({
    name:'tradeGroupsList',
    initialState:{
        tradeGroup:[],
        status: 'idle',
        error: null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(tradeGroups.pending,(state)=>{
                state.status='loading'
            })
            .addCase(tradeGroups.fulfilled,(state,action)=>{
                state.status = 'fullfilled'
                state.tradeGroup = action.payload
            })
            .addCase(tradeGroups.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Set the error message when the request fails
            });
    }
})

export default tradeGroupsSlice.reducer;
