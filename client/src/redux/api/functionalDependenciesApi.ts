import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FunctionalDependency } from '../../utils/types';

export const functionalDependenciesApi = createApi({
  reducerPath: 'functionalDependenciesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  endpoints: (builder) => ({
    addFunctionalDependencies: builder.mutation<void, FunctionalDependency[]>({
      query: (body) => ({
        url: '/tables/dependencies',
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const { useAddFunctionalDependenciesMutation } =
  functionalDependenciesApi;
