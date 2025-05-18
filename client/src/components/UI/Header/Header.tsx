import { Link, NavLink, useNavigate } from 'react-router';
import {
  useGetIsUserAuthQuery,
  useGetUserDataQuery,
  useLogoutUserMutation,
} from '../../../redux/api/userApi';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  clearUser,
  selectUser,
  setUserData,
} from '../../../redux/slices/userSlice';

export const Header = () => {
  const dispatch = useAppDispatch();
  const userDataSelector = useAppSelector(selectUser);
  const navigate = useNavigate();

  const {
    data: authStatus,
    isLoading: isAuthLoading,
    isFetching: isAuthFetching,
  } = useGetIsUserAuthQuery();

  const { data: userDataResponse } = useGetUserDataQuery(undefined, {
    skip: isAuthLoading || isAuthFetching || !authStatus?.success,
  });

  const [logout] = useLogoutUserMutation();

  React.useEffect(() => {
    if (userDataResponse?.success) {
      dispatch(setUserData(userDataResponse.userData));
    }
  }, [dispatch, userDataResponse]);

  const handleLogout = async () => {
    await logout()
      .unwrap()
      .then(() => {
        navigate('/');
        dispatch(clearUser());
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex justify-between border-b-[1px] border-[#E5E8EB] text-[#252b35] py-5">
      <NavLink to="/" className="flex items-center gap-1 font-bold text-xl p-2">
        <img src="favicon.svg" alt="logo" decoding="async" width="20px" />
        DBNormalizer
      </NavLink>
      <div className="flex justify-end items-center gap-9 font-medium">
        <NavLink to="/#advantages">Преимущества</NavLink>
        <NavLink to="/#how-to-use">Как использовать</NavLink>
        {userDataSelector.name ? (
          <div className="relative group flex justify-center items-center w-10 h-10 border rounded-full bg-blue-500 text-white hover:bg-blue-400 cursor-pointer transition-colors duration-200">
            {userDataSelector.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black pt-10">
              <ul className="bg-gray-100  rounded-xl text-sm p-2">
                <li className="py-1 px-2 hover:bg-gray-200  rounded-xl">
                  <Link to="/normalization">Нормализация</Link>
                </li>
                <li
                  className="py-1 px-2 hover:bg-gray-200 rounded-xl"
                  onClick={handleLogout}
                >
                  Выйти
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="bg-[#1A80E5] hover:bg-[#5ba3eb] text-white p-2 rounded-xl active:outline-2 active:outline-blue-400/50 transition duration-400 ease-in-out"
          >
            Войти
          </NavLink>
        )}
      </div>
    </div>
  );
};
