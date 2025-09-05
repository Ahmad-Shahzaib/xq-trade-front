// src/rtk/slices/filterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filterType: 'All', // Default filter type
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
  },
});

export const { setFilterType } = filterSlice.actions;

export const selectFilterType = (state) => state.filter.filterType;

export default filterSlice.reducer;
