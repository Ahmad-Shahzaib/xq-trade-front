import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1, apiKey, token } from "../../../utils/config";

// const testUrl = "https://5csb.w.time4vps.cloud:8005/trade/binary"
const testUrl = "https://apicon.brokercheap.com:8040/newapp/trade/binary"

export const placeOrder = createAsyncThunk(
    'order/placeOrder',
    async ({ orderPayload, onBinaryResponse }, { rejectWithValue }) => {

        console.log('🚀 Order Payload slice:', orderPayload);

        try {
            const storedToken = localStorage.getItem("token");
            const orderData = {
                trade_account_id: orderPayload.trade_account_id,
                symbol: orderPayload.symbol,
                stake: orderPayload.stake,
                direction: orderPayload.direction,
                expiry_seconds: orderPayload.expiry_seconds
            };

            const headers = {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
            };

            // 🔹 First, send request to testUrl
            const testResponse = await axios.post(testUrl, orderData, { headers });


            // 🔹 Call `onBinaryResponse` function (handleAddPointer) immediately
            if (onBinaryResponse) {
                onBinaryResponse();
            }

            // 🔹 Now, send request to the main API with testResponse included
            const finalPayload = {
                ...orderData,
                binary_response: testResponse.data
            };

            const primaryResponse = await axios.post(`${apiBaseUrl1}/trade/order`, finalPayload, { headers });

            return {
                primaryResponse: primaryResponse.data,
                testResponse: testResponse.data
            };

        } catch (error) {
            console.error("❌ Order API error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);






const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orderStatus: 'idle',
        orderData: null,
        binaryResponse: null,  // New state to store test API response
        error: null,
        orderMessage: '',
        orderFailedMessage: '',
        activeTrades: JSON.parse(localStorage.getItem("activeTrades")) || [],
        historyRefreshKey: 0,
        testResponse: null,
    },
    reducers: {
        updateBinaryResponse: (state, action) => {
            state.binaryResponse = action.payload;
            state.orderStatus = 'binary_received'; // Optional status update
        },
        addTrade: (state, action) => {
            state.activeTrades.push(action.payload);
            localStorage.setItem("activeTrades", JSON.stringify(state.activeTrades));
        },
        updateTradeTime: (state) => {
            state.activeTrades = state.activeTrades.map(trade => {
                const newRemainingTime = Math.max(0, trade?.remainingTime - 1);
                return newRemainingTime === 0 ? { ...trade, remainingTime: 0, expired: true } : { ...trade, remainingTime: newRemainingTime };
            });

            // ✅ If any trade expired, trigger history refresh
            const expiredTrade = state.activeTrades.find(trade => trade.expired);
            if (expiredTrade) {
                state.historyRefreshKey += 1;
            }

            // Remove expired trades
            state.activeTrades = state.activeTrades.filter(trade => !trade.expired);
            localStorage.setItem("activeTrades", JSON.stringify(state.activeTrades));
        },


        removeTrade: (state, action) => {
            const idToRemove = action.payload.toString(); // normalize to string
            state.activeTrades = state.activeTrades.filter(trade => trade.id.toString() !== idToRemove);
            localStorage.setItem("activeTrades", JSON.stringify(state.activeTrades));
            state.historyRefreshKey += 1;
        }
,
        loadTrades: (state) => {
            state.activeTrades = JSON.parse(localStorage.getItem("activeTrades")) || [];
        },
        clearOrderFailedMessage: (state) => {
            state.orderFailedMessage = "";  // ✅ Clears error message
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => {
                state.orderStatus = 'loading';
                state.orderData = null;
                state.error = null;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                // console.log("✅ Order placed successfully:", action.payload);
                state.orderStatus = 'succeeded';
                state.orderData = action.payload.primaryResponse;
                state.testResponse = action.payload?.testResponse;
                state.orderMessage = action.payload.primaryResponse?.message || "Trade Successful";

            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.orderStatus = 'failed';
                state.error = action.payload;
                if (state.selectedAccount) {
                    state.selectedAccount.balance += state.orderData?.stake || 0;
                }
                state.orderFailedMessage = "Trade failed! Please try again.";

            });
    }
});

// Export the new action
export const { updateBinaryResponse, addTrade, updateTradeTime, removeTrade, loadTrades } = orderSlice.actions;

export default orderSlice.reducer;



