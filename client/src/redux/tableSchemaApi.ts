import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TableSchema } from '../utils/types';

export const tableSchemaApi = createApi({
  reducerPath: 'tableSchemaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/',
  }),
  tagTypes: ['TableInfo'],
  endpoints: (builder) => ({
    getTableInfos: builder.query<TableSchema[], void>({
      query: () => '',
      providesTags: ['TableInfo'],
    }),
    createTableInfo: builder.mutation<void, TableSchema>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TableInfo'],
    }),
  }),
});

export const { useGetTableInfosQuery, useCreateTableInfoMutation } =
  tableSchemaApi;
