import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl, apiKey } from '../../../utils/config';


// Create an asynchronous thunk to fetch account details
export const fetchAccountDetails = createAsyncThunk(
    'accountDetails/fetchAccountDetails',
    async (account) => {
      const response = await axios.post(`${apiBaseUrl}/account-detail`, {
        api_key: apiKey,
        account,
      });
      const res = response.data
      const data = res.data
      return data; // Return only the data part
    }
  );

  // Create the account details slice
const accountDetailsSlice = createSlice({
    name: 'accountDetails',
    initialState: {
      account: null,
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAccountDetails.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAccountDetails.fulfilled, (state, action) => {
          state.loading = false;
          state.account = action.payload; // Store the fetched account data
        })
        .addCase(fetchAccountDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message; // Handle error
        });
    },
  });
  
  // Export the actions and reducer
  export const selectAccountDetails = (state) => state.accountDetails;
  export default accountDetailsSlice.reducer;