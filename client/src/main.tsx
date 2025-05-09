import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { PageNotFound } from './components/routes/PageNotFound';
import { MainLayout } from './components/routes/MainLayout';
import { Home } from './components/routes/Home';

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/auth',
        Component: App,
      },
    ],
  },
  {
    path: '*',
    Component: PageNotFound,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
