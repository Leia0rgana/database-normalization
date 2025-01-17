import { configureStore } from '@reduxjs/toolkit';
import attributeListReducer from './slices/attributeListSlice';

export const store = configureStore({
  reducer: {
    attributeList: attributeListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
