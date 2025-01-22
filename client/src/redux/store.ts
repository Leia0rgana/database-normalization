import { configureStore } from '@reduxjs/toolkit';
import tableSchemaReducer from './slices/tableSchemaSlice';

export const store = configureStore({
  reducer: {
    tableSchema: tableSchemaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
