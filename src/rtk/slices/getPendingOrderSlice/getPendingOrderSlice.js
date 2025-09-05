import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl, apiKey } from '../../../utils/config';

// Initial state
const initialState = {
    pendingOrders: [],
    loading: false,
    error: null,
};

// Async thunk for fetching pending orders
export const fetchPendingOrders = createAsyncThunk(
    'getPendingOrders/fetchPendingOrders',
    async (account, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${apiBaseUrl}/get-order-pending`, {
                api_key: apiKey,
                account: account
            });


            const res = response.data
            const data = res.data
            return data; // Return only the data part  // Ensure that the payload is an array of orders
        } catch (error) {
            console.error("Error fetching data:", error); // Log the error if API fails
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const getPendingOrdersSlice = createSlice({
    name: 'getPendingOrders',
    initialState,
    reducers: {
        addPosition: (state, action) => {
            // Add order data to pendingOrders state
            const newOrder = action.payload;
            state.pendingOrders.push(newOrder);
        },
        removePosition: (state, action) => {
            // Remove order based on the unique order_id or id
            const orderId = action.payload; // Assuming you're passing either order_id or id as the unique identifier
            state.pendingOrders = state.pendingOrders.filter(order => order.order_id !== orderId);

        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPendingOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingOrders.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    state.pendingOrders = action.payload;  // Ensure action.payload is an array
                } else {
                    console.error("Received data is not an array:", action.payload);
                }
            })
            .addCase(fetchPendingOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch pending orders';
            });
    },
});
export const { addPosition, removePosition } = getPendingOrdersSlice.actions;
export default getPendingOrdersSlice.reducer;
