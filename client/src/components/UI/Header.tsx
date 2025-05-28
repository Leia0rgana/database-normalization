import { Link, NavLink, useNavigate } from 'react-router';
import {
  useGetIsUserAuthQuery,
  useGetUserDataQuery,
  useLogoutUserMutation,
} from '../../redux/api/userApi';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  clearUser,
  selectUser,
  setUserData,
} from '../../redux/slices/userSlice';
import { setError } from '../../redux/slices/errorSlice';
import { ErrorNotification } from './ErrorNotification';
import { MdMenu } from 'react-icons/md';
import { useClickOutside } from '../../hooks/useClickOutside';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  const closeMenu = React.useCallback(() => setIsMenuOpen(false), []);
  const closeUserMenu = React.useCallback(() => setIsUserMenuOpen(false), []);

  useClickOutside(menuRef, closeMenu);
  useClickOutside(userMenuRef, closeUserMenu);

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
      .catch(() => {
        dispatch(setError('Не удалось выйти из аккаунта'));
      });
  };

  return (
    <>
      <ErrorNotification />
      <div className="flex items-center justify-between border-b-[1px] border-[#E5E8EB] text-[#252b35] py-5">
        <NavLink
          to="/"
          className="flex items-center gap-1 font-bold text-xl p-2"
        >
          <img src="favicon.svg" alt="logo" decoding="async" width="20px" />
          DBNormalizer
        </NavLink>
        <MdMenu
          className="sm:hidden w-8 h-8 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden '
          } sm:flex flex-col items-center absolute top-16 right-0 z-100000 bg-gray-100 rounded-lg p-4 shadow-lg sm:shadow-none sm:rounded-none sm:p-0 sm:bg-transparent sm:static sm:flex-row sm:justify-end sm:items-center gap-2 sm:gap-9 font-medium`}
          ref={menuRef}
        >
          <NavLink
            to="/#advantages"
            className="p-2 rounded-xl hover:bg-gray-200 sm:p-0 sm:border-none sm:hover:bg-transparent"
          >
            Преимущества
          </NavLink>
          <NavLink
            to="/#how-to-use"
            className="p-2 rounded-xl hover:bg-gray-200 sm:p-0 sm:border-none sm:hover:bg-transparent"
          >
            Как использовать
          </NavLink>
          {userDataSelector.name ? (
            <div
              className="relative flex justify-center items-center w-10 h-10 border rounded-full bg-blue-500 text-white hover:bg-blue-400 cursor-pointer transition-colors duration-200"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              ref={userMenuRef}
              role="button"
            >
              {userDataSelector.name[0].toUpperCase()}
              <div
                className={`absolute top-0 right-0 z-10 text-black pt-10 ${
                  isUserMenuOpen ? 'block' : 'hidden '
                }`}
              >
                <ul className="bg-gray-100  rounded-xl p-2">
                  <li className="p-2 hover:bg-gray-200 rounded-xl">
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
    </>
  );
};
