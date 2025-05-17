import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, UserData, Response } from '../../utils/types';

type UserResponse = {
  success: boolean;
  userData: UserData;
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    createUser: builder.mutation<void, User>({
      query: (body) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    loginUser: builder.mutation<void, User>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    logoutUser: builder.mutation<void, void>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    getUserData: builder.query<UserResponse, void>({
      query: () => '/user/data',
      providesTags: ['Auth'],
    }),
    getIsUserAuth: builder.query<Response, void>({
      query: () => '/auth/is-auth',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserDataQuery,
  useGetIsUserAuthQuery,
} = userApi;
