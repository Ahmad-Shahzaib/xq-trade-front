import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl, apiKey } from '../../../utils/config';

export const updatePendingOrder = createAsyncThunk(
    'orders/updatePendingOrder',
    async (orderData, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${apiBaseUrl}/update-pending-order`, {
          api_key: apiKey,
          account: orderData.account,
          order_id: orderData.order_id,
          ordre_price:orderData.ordre_price,
          sl: orderData.sl,
          tp: orderData.tp,
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



  const updatePendingOrderSlice = createSlice({
    name: 'updatePendingOrder',
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
        .addCase(updatePendingOrder.pending, (state) => {
          state.loading = true;
          state.successMessage = '';
          state.errorMessage = '';
        })
        .addCase(updatePendingOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.successMessage = action.payload.message 
        //   || 'Order Cancelled successfully';  // Default success message
          state.errorMessage = '';
        })
        .addCase(updatePendingOrder.rejected, (state, action) => {
          state.loading = false;
          state.successMessage = '';
          state.errorMessage = action.payload || 'Failed to Update the order';
        });
    }
  });
  
  export const { resetState } = updatePendingOrderSlice.actions;
  
  export default updatePendingOrderSlice.reducer;