import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { PageNotFound } from './components/routes/PageNotFound';
import { MainLayout } from './components/routes/MainLayout';
import { Home } from './components/routes/Home';
import { Login } from './components/routes/Login';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { AdminDashboard } from './components/routes/AdminDashboard.tsx';
import { ForbiddenPage } from './components/routes/ForbiddenPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/normalization',
        element: (
          <ProtectedRoute>
            <App />{' '}
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin-dashboard',
        element: (
          <ProtectedRoute isAdminRoute={true}>
            <AdminDashboard />{' '}
          </ProtectedRoute>
        ),
      },
      {
        path: '/forbidden',
        element: <ForbiddenPage />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
