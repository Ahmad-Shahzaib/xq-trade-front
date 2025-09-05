import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedSymbol: null,
    symbols: {},
    previousSymbols: {},
    symbolsToShow: []
};

const priceTradingSlice = createSlice({
    name: 'priceTrading',
    initialState,
    reducers: {
        setSelectedSymbol(state, action) {
            state.selectedSymbol = action.payload;
        },
        setSymbols(state, action) {
            const newSymbols = action.payload;

            // Update previousSymbols before setting new symbols
            for (const key in newSymbols) {
                if (state.symbols[key]) {
                    // Store previous bid and ask prices
                    state.previousSymbols[key] = {
                        bid: state.symbols[key].bid,
                        ask: state.symbols[key].ask
                    };
                } else {
                    // Initialize previous values for new symbols
                    state.previousSymbols[key] = {
                        bid: null,
                        ask: null
                    };
                }
            }

            // Merge new symbols
            state.symbols = {
                ...state.symbols,
                ...newSymbols,
            };
        },
        setSymbolToShow(state, action) {
            const symbol = action.payload;
            if (state.symbolsToShow.includes(symbol)) {
                // Remove symbol if it already exists in symbolsToShow
                state.symbolsToShow = state.symbolsToShow.filter(item => item !== symbol);
            } else {
                // Add symbol if it does not exist in symbolsToShow
                state.symbolsToShow.push(symbol);
            }
        },
    }
});

// Selector to get the symbols from the state
export const selectSymbols = (state) => state.PriceTrading.symbols;

// Selector to get previous symbols for comparison
export const selectPreviousSymbols = (state) => state.PriceTrading.previousSymbols;

export const { setSelectedSymbol, setSymbols, setSymbolToShow } = priceTradingSlice.actions;

export default priceTradingSlice.reducer;
