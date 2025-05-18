import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAppSelector } from '../../redux/hooks';
import { selectUser } from '../../redux/slices/userSlice';
import { useGetIsUserAuthQuery } from '../../redux/api/userApi';
import { ImSpinner2 } from 'react-icons/im';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userDataSelector = useAppSelector(selectUser);
  const location = useLocation();

  const {
    data: authStatus,
    isLoading: isAuthLoading,
    isFetching: isAuthFetching,
  } = useGetIsUserAuthQuery();

  if (isAuthLoading || isAuthFetching) {
    return <ImSpinner2 className="spinner m-auto h-[70vh]" />;
  }

  if (!userDataSelector.name && (!authStatus || !authStatus.success)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
