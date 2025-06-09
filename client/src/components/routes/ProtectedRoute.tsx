import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUser, setUserData } from '../../redux/slices/userSlice';
import {
  useGetIsUserAuthQuery,
  useGetUserDataQuery,
} from '../../redux/api/userApi';
import { ImSpinner2 } from 'react-icons/im';

type ProtectedRouteProps = {
  children: React.ReactNode;
  isAdminRoute?: boolean;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { isAdminRoute, children } = props;
  const dispatch = useAppDispatch();
  const userDataSelector = useAppSelector(selectUser);
  const location = useLocation();

  const {
    data: authStatus,
    isLoading: isAuthLoading,
    isFetching: isAuthFetching,
    isSuccess: isAuthRequestSuccessful,
    isError: isAuthRequestError,
  } = useGetIsUserAuthQuery();

  const {
    data: userDataResponse,
    isLoading: isUserDataLoading,
    isFetching: isUserDataFetching,
    isSuccess: isUserDataRequestSuccessful,
  } = useGetUserDataQuery(undefined, {
    skip:
      isAuthLoading ||
      isAuthFetching ||
      !isAuthRequestSuccessful ||
      (authStatus && !authStatus.success) ||
      isAuthRequestError,
  });

  React.useEffect(() => {
    if (
      isUserDataRequestSuccessful &&
      userDataResponse?.success &&
      userDataResponse.userData
    ) {
      dispatch(setUserData(userDataResponse.userData));
    }
  }, [dispatch, userDataResponse, isUserDataRequestSuccessful]);

  const isLoadingAuth = isAuthLoading || isAuthFetching;
  const shouldUserDataQueryRun = !(
    isAuthLoading ||
    isAuthFetching ||
    !isAuthRequestSuccessful ||
    (authStatus && !authStatus.success) ||
    isAuthRequestError
  );
  const isLoadingUserData =
    shouldUserDataQueryRun && (isUserDataLoading || isUserDataFetching);

  const actualUserData =
    isUserDataRequestSuccessful &&
    userDataResponse?.success &&
    userDataResponse.userData
      ? userDataResponse.userData
      : userDataSelector.name
      ? userDataSelector
      : null;

  if (isLoadingAuth || isLoadingUserData || !actualUserData) {
    return <ImSpinner2 className="spinner m-auto h-[70vh]" />;
  }

  const isAuthenticated =
    isAuthRequestSuccessful && authStatus?.success && actualUserData?.name;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (actualUserData?.role === 'admin') {
    if (
      !isAdminRoute &&
      location.pathname !== '/' &&
      location.pathname !== '/admin-dashboard'
    ) {
      return <Navigate to="/admin-dashboard" replace />;
    }
  } else {
    if (isAdminRoute) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <>{children}</>;
};
