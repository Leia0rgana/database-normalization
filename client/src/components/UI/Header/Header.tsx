import { NavLink } from 'react-router';

export const Header = () => {
  return (
    <div className="flex justify-between border-b-[1px] border-[#E5E8EB] py-5">
      <NavLink to="/" className="flex items-center gap-1 font-bold text-xl p-2">
        <img src="favicon.svg" alt="logo" decoding="async" width="20px" />
        DBNormalizer
      </NavLink>
      <div className="flex justify-end items-center gap-9 font-medium">
        <NavLink to="/#advantages">Преимущества</NavLink>
        <NavLink to="/#how-to-use">Как использовать</NavLink>
        <NavLink
          to="/auth"
          className="bg-[#1A80E5] hover:bg-[#5ba3eb] text-white p-2 rounded-xl active:outline-2 active:outline-blue-400/50 transition duration-400 ease-in-out"
        >
          Войти
        </NavLink>
      </div>
    </div>
  );
};
