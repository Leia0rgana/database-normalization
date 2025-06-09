import React from 'react';
import { Modal } from './UI/Modal';
import {
  UserInfoByAdmin,
  useUpdateUserByAdminRoleMutation,
} from '../redux/api/userApi';
import { useAppDispatch } from '../redux/hooks';
import { setError } from '../redux/slices/messageSlice';

type Props = {
  userData: UserInfoByAdmin;
  onClose: () => void;
};

export const EditUser = (props: Props) => {
  const { userData, onClose } = props;

  const [name, setName] = React.useState(userData.name);
  const [email, setEmail] = React.useState(userData.email);
  const [password, setPassword] = React.useState('********');

  const dispatch = useAppDispatch();

  const [updateUser, { isLoading }] = useUpdateUserByAdminRoleMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateUser({
      _id: userData._id,
      name: name,
      email: email,
      password: password,
    })
      .unwrap()
      .catch(() => dispatch(setError('Не удалось обновить пользователя')));
    if (onClose) onClose();
  };

  return (
    <Modal label="Редактировать пользователя">
      <form
        className="flex flex-col gap-4 items-start p-6 my-4 rounded-lg shadow-lg border border-gray-300"
        onSubmit={handleSubmit}
      >
        <span className="flex flex-col gap-2">
          <label htmlFor="editUserName" className="font-medium">
            Имя
          </label>
          <input
            id="editUserName"
            className="px-3 py-2 font-normal border border-gray-200 rounded transition-all duration-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </span>
        <span className="flex flex-col gap-2">
          <label htmlFor="editUserEmail" className="font-medium">
            Email
          </label>
          <input
            id="editUserEmail"
            className="px-3 py-2 font-normal border border-gray-200 rounded transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </span>
        <span className="flex flex-col gap-2">
          <label htmlFor="editUserPassword" className="font-medium">
            Пароль
          </label>
          <input
            id="editUserPassword"
            className="px-3 py-2 font-normal border border-gray-200 rounded transition-all duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </span>
        <span className="flex self-end gap-3">
          <button className="btn-primary" type="submit" disabled={isLoading}>
            Сохранить
          </button>
          <button className="btn-secondary" type="button" onClick={onClose}>
            Отмена
          </button>
        </span>
      </form>
    </Modal>
  );
};
