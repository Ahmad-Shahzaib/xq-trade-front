import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl1 } from '../../../utils/config';

export const fetchWalletList = createAsyncThunk(
    'wallets/fetchWalletList',
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${apiBaseUrl1}/wallets`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const res = response.data;
           

            const data = res?.data
            return data

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// Initial state
const initialState = {
    walletList: [],
    loading: false,
    error: null,
};

// Create Redux slice
const walletListSlice = createSlice({
    name: 'walletList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWalletList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWalletList.fulfilled, (state, action) => {
                state.loading = false;
                state.walletList  = action.payload; // ✅ Correct property access
                // state.walletList  = [] // ✅ Correct property access
            })
            .addCase(fetchWalletList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch trade transactions';
            });
    }
});

// Export reducer
export default walletListSlice.reducer;
