import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearInfo, selectInfo } from '../../redux/slices/messageSlice';

export const InfoNotification = () => {
  const infoMessage = useAppSelector(selectInfo);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (infoMessage) {
      toast.info(infoMessage);
      dispatch(clearInfo());
    }
  }, [infoMessage, dispatch]);

  return (
    <ToastContainer
      closeOnClick
      position="bottom-right"
      autoClose={2000}
      theme="colored"
    />
  );
};
