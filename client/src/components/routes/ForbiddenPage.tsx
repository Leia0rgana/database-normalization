import { Link } from 'react-router';

export const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center my-24 gap-1.5 text-[#252b35]">
      <h1 className="flex items-center text-center text-3xl font-semibold gap-1.5">
        Ой! У вас нет прав <br /> на просмотр этой страницы{' '}
      </h1>
      <span className="text-4xl">&#128547;</span>
      <Link
        to="/"
        className="underline hover:scale-101 transition-transform duration-300 ease-in-out"
      >
        Перейти на главную
      </Link>
    </div>
  );
};
