import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, UserData, Response } from '../../utils/types';

type UserResponse = {
  success: boolean;
  userData: UserData;
};

export type UserInfoByAdmin = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Auth', 'TableInfo', 'Users'],
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
      invalidatesTags: ['Auth', 'TableInfo'],
    }),
    logoutUser: builder.mutation<void, void>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'TableInfo'],
    }),
    getUserData: builder.query<UserResponse, void>({
      query: () => '/user/data',
      providesTags: ['Auth', 'TableInfo'],
    }),
    getIsUserAuth: builder.query<Response, void>({
      query: () => '/auth/is-auth',
      providesTags: ['Auth', 'TableInfo'],
    }),
    getUsersByAdminRole: builder.query<UserInfoByAdmin[], void>({
      query: () => '/admin/users',
      providesTags: ['Users'],
    }),
    deleteUserByAdminRole: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    updateUserByAdminRole: builder.mutation<UserInfoByAdmin, UserInfoByAdmin>({
      query(data) {
        const { _id, ...body } = data;
        return {
          url: `/admin/users/${_id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserDataQuery,
  useGetIsUserAuthQuery,
  useGetUsersByAdminRoleQuery,
  useDeleteUserByAdminRoleMutation,
  useUpdateUserByAdminRoleMutation,
} = userApi;
