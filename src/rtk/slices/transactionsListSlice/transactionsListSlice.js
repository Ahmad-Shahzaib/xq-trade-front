import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl1 } from '../../../utils/config';

// Async Thunk for fetching binary trade transactions
export const fetchTransactionsHistory = createAsyncThunk(
  'transactions/fetchTransactionsHistory',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl1}/transactions`,
       
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = response.data;
      

      return res.transactions

    //   if (res && res.transactions) {  // ✅ Corrected property access
    //     return {
    //       transactionsList: res.transactions.sort((a, b) => 
    //         new Date(a.created_at) - new Date(b.created_at) // ✅ Sort Ascending (Optional)
    //       ),
    //     };
    //   } else {
    //     return rejectWithValue('Invalid response structure from the API');
    //   }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  transactionsList: [],
  loading: false,
  error: null,
};

// Create Redux slice
const transactionsHistorySlice = createSlice({
  name: 'transactionsHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionsList = action.payload; // ✅ Correct property access
      })
      .addCase(fetchTransactionsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch trade transactions';
      });
  }
});

// Export reducer
export default transactionsHistorySlice.reducer;
