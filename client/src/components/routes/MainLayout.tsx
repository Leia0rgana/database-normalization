import { Outlet } from 'react-router';
import { Header } from '../UI/Header';

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
