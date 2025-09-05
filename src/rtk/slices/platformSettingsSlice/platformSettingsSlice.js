import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  oneClickTrade: false,
  oneClickClosing: false,
  showOrders: true,
  hiddenBalances: false,
  profitLine: false,
  strikePrices: false,
  chartTypesIcon: true,
  technicalAnalysis: false,
  safety: false,
};

// Load settings from localStorage
const loadSettings = () => {
  const storedSettings = JSON.parse(localStorage.getItem('appSettings'));
  return storedSettings ? storedSettings : initialState;
};

const platformSettingsSlice = createSlice({
  name: 'platformSettings',
  initialState: loadSettings(),
  reducers: {
    toggleSetting: (state, action) => {
      const setting = action.payload;
      state[setting] = !state[setting];

      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(state));
    },
  },
});

export const { toggleSetting } = platformSettingsSlice.actions;
export default platformSettingsSlice.reducer;
