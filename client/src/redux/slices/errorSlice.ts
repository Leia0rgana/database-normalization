import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

interface ErrorState {
  error: string;
}

const initialState: ErrorState = {
  error: '',
};

export const errorSlice = createSlice({
  initialState,
  name: 'error',
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: () => {
      return initialState;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export const selectError = (state: RootState) => state.error.error;
export default errorSlice.reducer;
