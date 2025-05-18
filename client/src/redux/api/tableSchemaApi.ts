import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TableSchema } from '../../utils/types';

export const tableSchemaApi = createApi({
  reducerPath: 'tableSchemaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',
  }),

  tagTypes: ['TableInfo'],
  endpoints: (builder) => ({
    getTableInfos: builder.query<TableSchema[], void>({
      query: () => '/tables',
      providesTags: ['TableInfo'],
    }),
    createTableInfo: builder.mutation<void, TableSchema>({
      query: (body) => ({
        url: '/tables',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TableInfo'],
    }),
  }),
});

export const { useGetTableInfosQuery, useCreateTableInfoMutation } =
  tableSchemaApi;
