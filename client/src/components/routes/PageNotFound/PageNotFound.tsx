import { Link, useRouteError } from 'react-router';

interface IRouteError {
  message?: string;
}

export const PageNotFound = () => {
  const error = useRouteError() as IRouteError;
  return (
    <>
      <h1>Ой! Такой страницы нет</h1>
      {error && (
        <p>
          <i>{error.message}</i>
        </p>
      )}
      <Link to="/">Перейти на главную</Link>
    </>
  );
};
