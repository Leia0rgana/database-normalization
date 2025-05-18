import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { PageNotFound } from './components/routes/PageNotFound';
import { MainLayout } from './components/routes/MainLayout';
import { Home } from './components/routes/Home';
import { Login } from './components/routes/Login.tsx';

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
        path: '/login',
        Component: Login,
      },
      {
        path: '/normalization',
        Component: App,
      },
      {
        path: '*',
        Component: PageNotFound,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
