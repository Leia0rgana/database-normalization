import { baseApi } from './baseApi.ts';
import { TableSchema } from '../../utils/types';

export const tableSchemaApi = baseApi.injectEndpoints({
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
