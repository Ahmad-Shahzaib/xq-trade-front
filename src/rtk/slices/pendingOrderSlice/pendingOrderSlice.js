import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1, apiKey } from "../../../utils/config";

const timeBasedUrl = "https://apicon.brokercheap.com:8040/newapp/trade/time_based"
const priceBasedUrl = "https://apicon.brokercheap.com:8040/newapp/trade/price_based"

export const placePendingOrder = createAsyncThunk(
  "order/placePendingOrder",
  async ({ type, orderPayload }, { rejectWithValue }) => {

    // console.log("Placing pending order with type:", type, "and payload:", orderPayload); // Removed console.log

    try {
      const storedToken = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      };

      // Step 1: Payload without binary_response for AI/testUrl
      const timeBasedPayload = {
        trade_account_id: orderPayload.trade_account_id,
        symbol: orderPayload.symbol,
        stake: orderPayload.stake,
        direction: orderPayload.direction,
        expiry_seconds: orderPayload.expiry_seconds,
        execution_time: orderPayload.execution_time,
        order_type: orderPayload.order_type,
        order_place_at: orderPayload.order_place_at,
      };

      const priceBasedPayload = {
        trade_account_id: orderPayload.trade_account_id,
        symbol: orderPayload.symbol,
        stake: orderPayload.stake,
        direction: orderPayload.direction,
        expiry_seconds: orderPayload.expiry_seconds,
        trigger_price: orderPayload.trigger_price,
        order_type: orderPayload.order_type,
        order_place_at: orderPayload.order_place_at,
      };

      let testResponse;
      if (type === "time") {
        testResponse = await axios.post(timeBasedUrl, timeBasedPayload, { headers })
      } else if (type === "price") {
        testResponse = await axios.post(priceBasedUrl, priceBasedPayload, { headers });
      }


      // Extract binary response from AI response
      const binaryResponse = testResponse.data;

      // Step 2: Final payload to base API with binary_response from AI
      const realPayload = {
        ...(type === "time" ? timeBasedPayload : priceBasedPayload),
        binary_response: binaryResponse,
      };


      const realResponse = await axios.post(
        `${apiBaseUrl1}/trade/order`,
        realPayload,
        { headers }
      );

      return realResponse.data;
    } catch (error) {
      console.error("Pending Order API error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const pendingOrderSlice = createSlice({
  name: 'pendingOrder',
  initialState: {
    pendingOrderStatus: 'idle',
    pendingOrderData: null,
    pendingOrderMessage: '',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placePendingOrder.pending, (state) => {
        state.pendingOrderStatus = 'loading';
        state.pendingOrderData = null;
        state.error = null;
      })
      .addCase(placePendingOrder.fulfilled, (state, action) => {
        state.pendingOrderStatus = 'succeeded';
        state.pendingOrderData = action.payload;
        state.pendingOrderMessage = action.payload.message
      })
      .addCase(placePendingOrder.rejected, (state, action) => {
        state.pendingOrderStatus = 'failed';
        state.error = action.payload;
      });
  }
});


export default pendingOrderSlice.reducer;
