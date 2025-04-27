import { baseApi } from './baseApi';
import { FunctionalDependency } from '../../utils/types';

export const functionalDependenciesApi = baseApi.injectEndpoints({
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
