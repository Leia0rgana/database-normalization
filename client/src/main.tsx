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
