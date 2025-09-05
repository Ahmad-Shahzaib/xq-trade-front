// lockSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load initial state from local storage
const initialState = {
    isLocked: localStorage.getItem('isLocked') === 'true', 
};

const lockSlice = createSlice({
    name: 'lock',
    initialState,
    reducers: {
        lockScreen: (state) => {
            console.log('Locking screen...');
            state.isLocked = true;
            localStorage.setItem('isLocked', 'true'); 
        },
        unlockScreen: (state) => {
            console.log('Unlocking screen...');
            state.isLocked = false;
            localStorage.setItem('isLocked', 'false'); 
        },
    },
});

export const { lockScreen, unlockScreen } = lockSlice.actions;

export default lockSlice.reducer;
