import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../api/axiosInstance';
import { token } from '../../../../utils/config';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login API error:', error);
            return rejectWithValue(error.response ? error.response.data : 'Network error' || error.response?.data?.message || 'An error occurred');
        }
    }
);

const initialState = {
    user: JSON.parse(localStorage.getItem('crm-user')) || null,
    token: token || null,
    depositSummary: null,
    withdrawalSummary: null,
    tradeAccounts: [],
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.depositSummary = null;
            state.withdrawalSummary = null;
            state.tradeAccounts = [];
            localStorage.removeItem('crm-user');
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { access_token, user, dashboard, trade_accounts } = action.payload || {};
                

                if (access_token && user && dashboard && trade_accounts) {
                    state.user = user;
                    state.token = access_token;
                    state.depositSummary = dashboard?.deposits;
                    state.withdrawalSummary = dashboard?.withdrawals;
                    state.tradeAccounts = user.trade_accounts;

                    // Store essential data in localStorage
                    localStorage.setItem('crm-user', JSON.stringify(user));
                    localStorage.setItem('token', access_token);
                    if (!localStorage.getItem("selectedAccount")) {
                        // If no selected account, set the first one
                        localStorage.setItem("selectedAccount", JSON.stringify(trade_accounts[0]));
                    } else {
                        const storedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
                    
                        // Check if storedAccount exists in trade_accounts
                        const isValidAccount = trade_accounts.some(account => account.id === storedAccount.id);
                    
                        if (!isValidAccount) {
                            // If storedAccount is not found, reset to first account
                            localStorage.setItem("selectedAccount", JSON.stringify(trade_accounts[0]));
                        }
                    }
                    
                } else {
                    state.status = 'failed';
                    state.error = 'Unexpected API response structure';
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Login failed';
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
