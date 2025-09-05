import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl, apiKey } from '../../../utils/config';
import { controllers } from "chart.js";

export const getStaticSymbols = createAsyncThunk(
    'StaticSymbols/getStaticSymbols',
    async () => {
        const response = await axios.get(`${apiBaseUrl}/all-symbols`, {
            api_key: apiKey,
            // account,
        });
        const res = response.data;
        const data = res.data;
        return data; // Return only the data part
    }
);

const initialState = {
    symbols: {},
    selectedSymbols: JSON.parse(localStorage.getItem('selectedSymbols')) || [
        "XAUUSD", "BTCUSD", "USDJPY", "GBPUSD", "GBPCAD", "USDCHF", "EURUSD", "AUDUSD",
        "GBPNZD", "AUDJPY", "EURCAD", "EURGBP", "CADJPY", "EURJPY", "GBPJPY"
    ],
    selectedSymbol: null,
    clickedSymbolData: null,
    clickedSymbolAsk: null,
    clickedSymbolBid: null,
    isModalOpen: false,
    staticSymbols: [],
    filteredStaticSymbols: [],  // Add filteredStaticSymbols to store
    decimalPlaces:null,
    loading: false,
    error: null,
};

const tradingSlice = createSlice({
    name: 'trading',
    initialState,
    reducers: {
        setSelectedSymbol(state, action) {
            state.selectedSymbol = action.payload || "BTCUSD.ex1";
        },
        setSymbols: (state, action) => {
            const { symbol, bid, ask } = action.payload;
            state.symbols[symbol] = { bid, ask ,spread: (ask - bid)};
        },
        setSelectedSymbols: (state, action) => {
            state.selectedSymbols = action.payload;
            localStorage.setItem('selectedSymbols', JSON.stringify(action.payload));
        },
        setClickedSymbolData: (state, action) => {
            const symbol = action.payload;
            
            state.clickedSymbolData = symbol;
            if (state.symbols[symbol]) {
                state.clickedSymbolAsk = state.symbols[symbol].ask;
                state.clickedSymbolBid = state.symbols[symbol].bid;
            } else {
                state.clickedSymbolAsk = null;
                state.clickedSymbolBid = null;
            }
        },
        setClickedSymbolAsk: (state, action) => {
            state.clickedSymbolAsk = action.payload;
        },
        setClickedSymbolBid: (state, action) => {
            state.clickedSymbolBid = action.payload;
        },
        toggleTradingModal: (state) => {
            state.isModalOpen = !state.isModalOpen;
        },
        setFilteredStaticSymbols: (state) => {
            const simplifiedStaticSymbols = state.staticSymbols.map(({ Symbol, ask, bid,Spread }) => ({
                symbol: Symbol,
                ask: ask + Spread  , 
                bid: bid - Spread, 
            }));

            // Filter the static symbols based on selectedSymbols
            state.filteredStaticSymbols = simplifiedStaticSymbols.filter(({ symbol }) =>
                state.selectedSymbols.includes(symbol)
            );
        },
        setDecimalPlaces:(state,action)=>{
            const { symbol, digits } = action.payload;
            state.decimalPlaces[symbol] = digits;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStaticSymbols.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStaticSymbols.fulfilled, (state, action) => {
                state.loading = false;
                state.staticSymbols = action.payload;
                // Once static symbols are fetched, filter them
                state.filteredStaticSymbols = state.staticSymbols
                    .map(({ Symbol, ask, bid }) => ({ symbol: Symbol, ask, bid }))
                    .filter(({ symbol }) => state.selectedSymbols.includes(symbol));
            })
            .addCase(getStaticSymbols.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Handle error
            });
    },
});

export const selectSymbols = (state) => state.trading.symbols;
export const selectFilteredStaticSymbols = (state) => state.trading.filteredStaticSymbols;  // Export filtered static symbols selector

export const { 
    toggleTradingModal, 
    setFilteredStaticSymbols 
} = tradingSlice.actions;

export const { 
    setSymbols, 
    setSelectedSymbols, 
    setClickedSymbolData, 
    setSelectedSymbol, 
    setClickedSymbolAsk, 
    setClickedSymbolBid 
    ,setDecimalPlaces
} = tradingSlice.actions;

export default tradingSlice.reducer;
