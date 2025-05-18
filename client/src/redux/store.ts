import { configureStore } from '@reduxjs/toolkit';
import tableSchemaReducer from './slices/tableSchemaSlice';
import functionalDependenciesReducer from './slices/functionalDependenciesSlice';
import userReducer from './slices/userSlice';
import { tableSchemaApi } from './api/tableSchemaApi';
import { functionalDependenciesApi } from './api/functionalDependenciesApi';
import { userApi } from './api/userApi';
import errorReducer from './slices/errorSlice';

export const store = configureStore({
  reducer: {
    [tableSchemaApi.reducerPath]: tableSchemaApi.reducer,
    [functionalDependenciesApi.reducerPath]: functionalDependenciesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    tableSchema: tableSchemaReducer,
    functionalDependencies: functionalDependenciesReducer,
    user: userReducer,
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tableSchemaApi.middleware,
      functionalDependenciesApi.middleware,
      userApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
