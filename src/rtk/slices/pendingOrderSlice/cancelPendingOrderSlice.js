import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl, apiBaseUrl1, apiKey } from '../../../utils/config';

export const cancelPendingOrder = createAsyncThunk(
  'orders/cancelPendingOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Ensure token is retrieved from local storage
      const response = await axios.post(`${apiBaseUrl1}/trade/cancel-pending-order`,
        {
          id: orderData.order_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Corrected header placement
          },
        });

      // Ensure response and data exist
      if (response && response.data) {
        const res = response.data

        return res;  // Return the API response data
      } else {
        return rejectWithValue('No response data found.');
      }
    } catch (error) {
      // Check if there's a specific error response from the server
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue('An unknown error occurred.');
      }
    }
  }
);



const cancelPendingOrderSlice = createSlice({
  name: 'cancelPendingOrder',
  initialState: {
    loading: false,
    successMessage: '',
    errorMessage: ''
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.successMessage = '';
      state.errorMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(cancelPendingOrder.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(cancelPendingOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message
        //   || 'Order Cancelled successfully';  // Default success message
        state.errorMessage = '';
      })
      .addCase(cancelPendingOrder.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = '';
        state.errorMessage = action.payload || 'Failed to Cancel the order';
      });
  }
});

export const { resetState } = cancelPendingOrderSlice.actions;

export default cancelPendingOrderSlice.reducer;