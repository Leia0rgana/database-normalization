import React from 'react';
import { DeleteUser } from '../DeleteUser';
import { useGetUsersByAdminRoleQuery } from '../../redux/api/userApi';
import { ImSpinner2 } from 'react-icons/im';
import { UserInTable } from '../UserInTable';
import { EditUser } from '../EditUser';

export const AdminDashboard = () => {
  const [deletingUserId, setDeletingUserId] = React.useState<string | null>(
    null
  );
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null);

  const { data, isLoading, isFetching, isError } =
    useGetUsersByAdminRoleQuery();

  if (isLoading || isFetching)
    return <ImSpinner2 className="spinner text-2xl m-auto self-center p-2" />;

  if (isError)
    return (
      <div className="text-gray-500 text-center my-15">
        Невозможно загрузить список пользователей
      </div>
    );

  const userToDelete = data?.find((user) => user._id === deletingUserId);
  const userToEdit = data?.find((user) => user._id === editingUserId);

  return (
    <>
      <div className="container w-fit mx-auto p-4">
        {(isLoading || isFetching) && (
          <ImSpinner2 className="spinner text-2xl self-center p-2 m-2" />
        )}
        <h1 className="text-2xl font-semibold my-6 text-gray-700 text-center">
          Управление пользователями
        </h1>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="table-auto">
            <thead>
              <tr className=" bg-gray-200 text-gray-600 uppercase py-2 px-4 text-sm leading-normal">
                <th className="py-3 px-5 text-center ">Имя</th>
                <th className="py-3 px-5 text-center ">Email</th>
                <th className="py-3 px-5 text-center ">Пароль</th>
                <th className="py-3 px-5 text-center">Действия</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {data?.map((userData) => (
                <UserInTable
                  key={userData._id || userData.name}
                  userData={userData}
                  onDelete={() => {
                    if (userData._id) setDeletingUserId(userData._id);
                  }}
                  onEdit={() => {
                    if (userData._id) setEditingUserId(userData._id);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {userToDelete && (
        <DeleteUser
          userData={userToDelete}
          onClose={() => setDeletingUserId(null)}
        />
      )}
      {userToEdit && (
        <EditUser
          userData={userToEdit}
          onClose={() => setEditingUserId(null)}
        />
      )}
    </>
  );
};
