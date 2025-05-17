import React from 'react';
import { LuUser, LuMail, LuLockKeyhole } from 'react-icons/lu';
import {
  useCreateUserMutation,
  useLoginUserMutation,
} from '../../redux/api/userApi';
import { useNavigate } from 'react-router';

export const Login = () => {
  const [mode, setMode] = React.useState<'Зарегистрироваться' | 'Войти'>(
    'Зарегистрироваться'
  );
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const [createUser] = useCreateUserMutation();
  const [loginUser] = useLoginUserMutation();

  const navigate = useNavigate();

  const INPUT_CONTAINER_CLASSNAME = 'flex items-center gap-3 justify-center';
  const INPUT_CLASSNAME =
    'w-[90%] px-3 py-2 font-normal bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200';

  const toggleMode = () =>
    mode === 'Зарегистрироваться'
      ? setMode('Войти')
      : setMode('Зарегистрироваться');
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (mode === 'Зарегистрироваться') {
      await createUser({
        name: name,
        email: email,
        password: password,
      })
        .unwrap()
        .then(() => navigate('/app'))
        .catch((error) => console.log(error));
    } else {
      await loginUser({
        email: email,
        password: password,
      })
        .unwrap()
        .then(() => navigate('/app'))
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className="flex items-center justify-center flex-col my-10 mx-auto max-w-[400px] rounded-lg shadow-lg border border-gray-300 p-8 bg-gradient-to-br from-blue-50 to-purple-100 text-[#252b35]">
      <h2 className="text-2xl font-semibold text-center mb-3">
        {mode === 'Зарегистрироваться' ? 'Создание аккаунта' : 'Вход'}
      </h2>
      <p className="text-center mb-6">
        {mode === 'Зарегистрироваться'
          ? 'Зарегистрируйтесь с помощью электронной почты'
          : 'Войдите в аккаунт с помощью логина и пароля'}
      </p>
      <form
        className="flex flex-col items-center gap-7 w-full"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5 w-full">
          {mode === 'Зарегистрироваться' && (
            <div className={INPUT_CONTAINER_CLASSNAME}>
              <LuUser />
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={INPUT_CLASSNAME}
              />
            </div>
          )}
          <div className={INPUT_CONTAINER_CLASSNAME}>
            <LuMail />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={INPUT_CLASSNAME}
            />
          </div>
          <div className={INPUT_CONTAINER_CLASSNAME}>
            <LuLockKeyhole />
            <input
              type="text"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={INPUT_CLASSNAME}
            />
          </div>
          <button
            className="self-end text-sm text-[#252b35] hover:text-[#080077]"
            type="button"
            onClick={toggleMode}
          >
            {mode === 'Зарегистрироваться' ? (
              <>У меня есть аккаунт</>
            ) : (
              <>У меня нет аккаунта</>
            )}
          </button>
        </div>
        <button
          className="btn-primary rounded-xl min-w-[190px]"
          disabled={
            !email || !password || (mode === 'Зарегистрироваться' && !name)
          }
          type="submit"
        >
          {mode}
        </button>
      </form>
    </div>
  );
};
