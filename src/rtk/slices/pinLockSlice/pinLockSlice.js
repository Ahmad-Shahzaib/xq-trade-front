import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLockEnabled: localStorage.getItem('lockEnabled') === 'true',
  pin: localStorage.getItem('appPin') || '',
  // isLocked: localStorage.getItem('lockEnabled') === 'true' && localStorage.getItem('appPin'),
  isLocked: localStorage.getItem('lockEnabled') === 'true' && !!localStorage.getItem('appPin'),

};

const pinLockSlice = createSlice({
  name: 'pinLock',
  initialState,
  reducers: {
    setPin(state, action) {
      state.pin = action.payload;
      localStorage.setItem('appPin', action.payload);
    },
    toggleLock(state, action) {
      state.isLockEnabled = action.payload;
      localStorage.setItem('lockEnabled', action.payload.toString());

      if (!action.payload) {
        localStorage.removeItem('appPin');
        state.pin = '';
        state.isLocked = false;
      }
    },
    unlockApp(state) {
      state.isLocked = false;
    },
    lockApp(state) {
      if (state.isLockEnabled && state.pin) {
        state.isLocked = true;
      }
    },
  },
});

export const { setPin, toggleLock, unlockApp, lockApp } = pinLockSlice.actions;
export default pinLockSlice.reducer;
