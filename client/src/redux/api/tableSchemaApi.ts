import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TableSchema } from '../../utils/types';

export const tableSchemaApi = createApi({
  reducerPath: 'tableSchemaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',
  }),

  tagTypes: ['TableInfo', 'Auth'],
  endpoints: (builder) => ({
    getTableInfos: builder.query<TableSchema[], void>({
      query: () => '/tables',
      providesTags: ['TableInfo', 'Auth'],
    }),
    createTableInfo: builder.mutation<void, TableSchema>({
      query: (body) => ({
        url: '/tables',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TableInfo'],
    }),
    normalizeTable: builder.mutation<TableSchema[], TableSchema>({
      query: (body) => ({
        url: `/tables/normalize/${body.name}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TableInfo'],
    }),
    deleteTable: builder.mutation<void, string>({
      query: (name: string) => ({
        url: `/tables/${name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TableInfo'],
    }),
    updateTable: builder.mutation<TableSchema, TableSchema>({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `tables/${_id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['TableInfo'],
    }),
  }),
});

export const {
  useGetTableInfosQuery,
  useCreateTableInfoMutation,
  useNormalizeTableMutation,
  useDeleteTableMutation,
  useUpdateTableMutation,
} = tableSchemaApi;
