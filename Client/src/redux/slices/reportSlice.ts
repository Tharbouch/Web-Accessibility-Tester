import { createSlice } from '@reduxjs/toolkit';
import { stateType } from '../store';
const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    allReports: [],
    selectedReport: null,
  },
  reducers: {
    setReports(state, action) {
      state.allReports = action.payload;
    },
    selectReport(state, action) {
      state.selectedReport = action.payload;
    },
  },
});

export const { setReports, selectReport } = reportSlice.actions;
export const selectReports = (state:stateType) => state.reports;
export default reportSlice.reducer;