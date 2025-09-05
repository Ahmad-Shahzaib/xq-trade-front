import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl, apiKey } from '../../../utils/config';

const initialState = {
    positions: [],
    loading: false,
    error: null,
    tP: ''
};

export const fetchOpenPositions = createAsyncThunk(
    'openPositions/fetchOpenPositions',
    async (account) => {
        const response = await axios.post(`${apiBaseUrl}/open-position`, {
            api_key: apiKey,
            account: account
        });
        const res  = response.data
        const data = res.data
        return data;
    }
);

const openPositionsSlice = createSlice({
    name: 'openPositions',
    initialState,
    reducers: {
        addPosition: (state, action) => {
            const existingPositionIndex = state.positions.findIndex(
                position => position.positionid === action.payload.positionid
            );
            
            if (existingPositionIndex !== -1) {
                state.positions[existingPositionIndex] = action.payload;
            } else {
                state.positions.push(action.payload);
            }
        },
        removePosition: (state, action) => {
            state.positions = state.positions.filter(
                position => position.positionid !== action.payload
            );
        },
         // Add a new reducer to set total profit
         setTP: (state, action) => {
            state.tP = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOpenPositions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOpenPositions.fulfilled, (state, action) => {
                state.loading = false;
                state.positions = action.payload;
            })
            .addCase(fetchOpenPositions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { addPosition, removePosition, setTP  } = openPositionsSlice.actions;
export const selectOpenPositions = (state) => state.openPositions;
export default openPositionsSlice.reducer;
