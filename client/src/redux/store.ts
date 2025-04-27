import { configureStore } from '@reduxjs/toolkit';
import tableSchemaReducer from './slices/tableSchemaSlice';
import functionalDependenciesReducer from './slices/functionalDependenciesSlice';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    tableSchema: tableSchemaReducer,
    functionalDependencies: functionalDependenciesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
