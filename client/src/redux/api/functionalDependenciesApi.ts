import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FunctionalDependency } from '../../utils/types';

export const functionalDependenciesApi = createApi({
  reducerPath: 'functionalDependenciesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ['Dependencies'],
  endpoints: (builder) => ({
    addFunctionalDependencies: builder.mutation<void, FunctionalDependency[]>({
      query: (body) => ({
        url: '/tables/dependencies',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Dependencies'],
    }),
    getFunctionalDependencies: builder.query<FunctionalDependency[], string>({
      query: (name: string) => `/tables/dependencies/${name}`,
      providesTags: ['Dependencies'],
    }),
  }),
});

export const {
  useAddFunctionalDependenciesMutation,
  useGetFunctionalDependenciesQuery,
} = functionalDependenciesApi;
