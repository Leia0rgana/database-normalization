import { Modal } from './UI/Modal';
import {
  useDeleteUserByAdminRoleMutation,
  UserInfoByAdmin,
} from '../redux/api/userApi';
import { useAppDispatch } from '../redux/hooks';
import { setError } from '../redux/slices/messageSlice';

type Props = {
  userData: UserInfoByAdmin;
  onClose?: () => void;
};

export const DeleteUser = (props: Props) => {
  const { userData, onClose } = props;
  const dispatch = useAppDispatch();
  const [deleteUser] = useDeleteUserByAdminRoleMutation();

  const handleDelete = async () => {
    if (userData?._id)
      await deleteUser(userData._id)
        .unwrap()
        .then(() => {
          if (onClose) onClose();
        })
        .catch(() => {
          dispatch(setError('Не удалось удалить пользователя'));
        });
  };

  return (
    <Modal label="Удаление пользователя">
      <div className="flex flex-col gap-5">
        <div className="text-center">
          Вы уверены, что хотите удалить пользователя {userData?.email}?
          <br /> Это действие нельзя отменить
        </div>
        <span className="flex justify-center gap-5">
          <button className="btn-primary" onClick={handleDelete}>
            OK
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Отмена
          </button>
        </span>
      </div>
    </Modal>
  );
};
