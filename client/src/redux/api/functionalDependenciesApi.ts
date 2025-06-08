import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FunctionalDependency } from '../../utils/types';

type UpdateDependenciesArg = {
  tableName: string;
  functionalDependencies: FunctionalDependency[];
};

export const functionalDependenciesApi = createApi({
  reducerPath: 'functionalDependenciesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',
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
    updateFunctionalDependencies: builder.mutation<
      FunctionalDependency[],
      UpdateDependenciesArg
    >({
      query: (data) => {
        const { tableName, ...body } = data;
        return {
          url: `/tables/dependencies/${tableName}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['Dependencies'],
    }),
  }),
});

export const {
  useAddFunctionalDependenciesMutation,
  useGetFunctionalDependenciesQuery,
  useUpdateFunctionalDependenciesMutation,
} = functionalDependenciesApi;
