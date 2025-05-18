import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearError, selectError } from '../../redux/slices/errorSlice';

export const ErrorNotification = () => {
  const errorMessage = useAppSelector(selectError);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearError());
    }
  }, [errorMessage, dispatch]);

  return (
    <ToastContainer
      closeOnClick
      position="top-right"
      autoClose={2000}
      theme="colored"
    />
  );
};
