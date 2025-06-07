import React from 'react';
import { LuUser, LuMail, LuLockKeyhole } from 'react-icons/lu';
import { ImSpinner2 } from 'react-icons/im';
import {
  useCreateUserMutation,
  useLoginUserMutation,
} from '../../redux/api/userApi';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setError } from '../../redux/slices/errorSlice';

export const Login = () => {
  const [mode, setMode] = React.useState<'Зарегистрироваться' | 'Войти'>(
    'Войти'
  );
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation();
  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || '/normalization';

  const INPUT_CONTAINER_CLASSNAME = 'flex items-center gap-3 justify-center';
  const INPUT_CLASSNAME =
    'w-[90%] px-3 py-2 font-normal bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200';

  const toggleMode = () => {
    if (mode === 'Зарегистрироваться') setMode('Войти');
    else setMode('Зарегистрироваться');

    setName('');
    setEmail('');
    setPassword('');
  };

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
        .then(() => {
          navigate('/normalization');
        })
        .catch(() => {
          dispatch(setError('Не удалось создать аккаунт с такими данными'));
        });
    } else {
      await loginUser({
        email: email,
        password: password,
      })
        .unwrap()
        .then(() => {
          navigate(from, { replace: true });
        })
        .catch(() => {
          dispatch(setError('Данные для входа некорректны'));
        });
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
      <>
        {isCreateLoading || isLoginLoading ? (
          <ImSpinner2 className="spinner" />
        ) : (
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
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={INPUT_CLASSNAME}
                />
              </div>
              <button
                className="self-end text-sm underline text-[#252b35] hover:text-[#080077]"
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
                !email ||
                !password ||
                (mode === 'Зарегистрироваться' && !name) ||
                isLoginLoading ||
                isCreateLoading
              }
              type="submit"
            >
              {mode}
            </button>
          </form>
        )}
      </>
    </div>
  );
};
