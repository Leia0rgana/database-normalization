import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Attribute, FunctionalDependency } from '../utils/types';

type Request = {
  name: string;
  attributeList: Array<Attribute>;
  functionalDependencies?: Array<FunctionalDependency>;
};

export const tableSchemaApi = createApi({
  reducerPath: 'tableSchemaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/',
  }),
  endpoints: (builder) => ({
    createTableInfo: builder.mutation<void, Request>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateTableInfoMutation } = tableSchemaApi;
