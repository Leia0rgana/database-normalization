import { Link } from 'react-router';

export const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center my-24 gap-1.5 text-[#252b35]">
      <h1 className="flex items-center text-3xl font-semibold gap-1.5">
        Ой! Такой страницы нет <span className="text-4xl">&#128547;</span>
      </h1>
      <Link
        to="/"
        className="underline hover:scale-101 transition-transform duration-300 ease-in-out"
      >
        Перейти на главную
      </Link>
    </div>
  );
};
