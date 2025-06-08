import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

interface MessageState {
  error: string;
  info: string;
}

const initialState: MessageState = {
  error: '',
  info: '',
};

export const errorSlice = createSlice({
  initialState,
  name: 'message',
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
    setInfo: (state, action: PayloadAction<string>) => {
      state.info = action.payload;
    },
    clearInfo: (state) => {
      state.info = '';
    },
  },
});

export const { setError, clearError, setInfo, clearInfo } = errorSlice.actions;
export const selectError = (state: RootState) => state.message.error;
export const selectInfo = (state: RootState) => state.message.info;
export default errorSlice.reducer;
