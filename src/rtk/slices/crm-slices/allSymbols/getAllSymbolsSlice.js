import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../api/axiosInstance"; 

// Async thunk to get AllSymbols information from the backend
export const getAllSymbols = createAsyncThunk(
    'allsymbols/getAllSymbols',
    async (token, { rejectWithValue }) => {
        try {
            // Send a GET request to fetch AllSymbols details
            const response = await axiosInstance.get('/all-symbols', {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send token in Authorization header
                }
            });
            return response.data.data;  // Return the fetched AllSymbols data
        } catch (error) {
            if (error.response) {
                console.error('Get AllSymbols API error:', error.response.data);
                return rejectWithValue(error.response.data);  // Return detailed error from API
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);

// Create a slice for managing AllSymbols state
const getAllSymbolsSlice = createSlice({
    name: 'getAllSymbols',
    initialState: {
        getAllSymbols: [
           { 
            profit_percentage: 0,
            symbol: "BTCUSD",
            category: "Cryptocurrencies"
         },
         { 
            profit_percentage: 2.5,
            symbol: "ETHUSD",
            category: "Cryptocurrencies"
         },
         { 
            profit_percentage: -1.2,
            symbol: "EURUSD",
            category: "Currencies"
         },
         { 
            profit_percentage: 0.8,
            symbol: "GBPUSD",
            category: "Currencies"
         },
         { 
            profit_percentage: 1.5,
            symbol: "AAPL",
            category: "Stocks"
         },
         { 
            profit_percentage: -0.3,
            symbol: "GOOGL",
            category: "Stocks"
         },
         { 
            profit_percentage: 3.2,
            symbol: "XAUUSD",
            category: "Commodities"
         },
         { 
            profit_percentage: -2.1,
            symbol: "CRUDE",
            category: "Commodities"
         },
         { 
            profit_percentage: 0.5,
            symbol: "SPX500",
            category: "Indices"
         }
        ],
        status: 'idle',
        error: null,
        
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSymbols.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllSymbols.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.getAllSymbols = action.payload;  // Set the AllSymbols data when the request is successful                
            })
            .addCase(getAllSymbols.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;  // Set the error message when the request fails
            });
    },
});

export default getAllSymbolsSlice.reducer;
