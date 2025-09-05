// src/rtk/slices/orderCloseSlice/orderCloseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl, apiKey } from '../../../utils/config';

// Define the async thunk for closing orders
export const closeOrder = createAsyncThunk(
  'orders/closeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/order-close`, {
        api_key: apiKey,
        account: orderData.account,
        symbol: orderData.symbol,
        volume: orderData.volume,
        price: orderData.price,
        type: orderData.type,
        tp: orderData.tp,
        sl: orderData.sl,
        comment: orderData.comment,
        position_id: orderData.position_id
      });
      
      // Ensure response and data exist
      if (response && response.data) {
        
        return response.data;  // Return the API response data
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

const orderCloseSlice = createSlice({
  name: 'orderClose',
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
      .addCase(closeOrder.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(closeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Order closed successfully';  // Default success message
        state.errorMessage = '';
      })
      .addCase(closeOrder.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = '';
        state.errorMessage = action.payload || 'Failed to close the order';
      });
  }
});

export const { resetState } = orderCloseSlice.actions;

export default orderCloseSlice.reducer;
