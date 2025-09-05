import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance";


export const getUserDashboard = createAsyncThunk(
    'userDashboard/getUserDashboard',
    async (token, { rejectWithValue }) => {
        try {
            // Send a GET request to fetch user details
            const response = await axiosInstance.get('/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send token in Authorization header
                }
            });
            return response.data;  // Return the fetched user data
        } catch (error) {
            if (error.response) {
                console.error('userDashboard API error:', error.response.data);
                return rejectWithValue(error.response.data);  // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
)

const userDashboardSlice = createSlice({
    name: 'userDashboard',
    initialState: {
        dashboardData: null,
        depositSummary: [],
        withdrawalSummary: [],
        tradeAccounts: [],
        status: 'idle',
        error: null,
        userStats: {}
    },
    reducers: {
        setUserStats: (state, action) => {
            state.userStats = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDashboard.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserDashboard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dashboardData = action.payload;  // Set the user data when the request is successful
                state.depositSummary = action.payload.deposits;
                state.withdrawalSummary = action.payload.withdrawals;
                state.tradeAccounts = action.payload.trade_accounts;



            })
            .addCase(getUserDashboard.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;  // Set the error message when the request fails
            });
    },
});
export const { setUserStats } = userDashboardSlice.actions;
export default userDashboardSlice.reducer;
