import { configureStore } from '@reduxjs/toolkit';
import { tableSchemaApi } from './tableSchemaApi';
import tableSchemaReducer from './slices/tableSchemaSlice';

export const store = configureStore({
  reducer: {
    tableSchema: tableSchemaReducer,
    [tableSchemaApi.reducerPath]: tableSchemaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tableSchemaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
