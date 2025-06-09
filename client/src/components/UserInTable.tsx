import { UserInfoByAdmin } from '../redux/api/userApi';
import { VscEdit } from 'react-icons/vsc';
import { AiOutlineDelete } from 'react-icons/ai';

type Props = {
  userData: UserInfoByAdmin;
  onDelete: () => void;
  onEdit: () => void;
};

export const UserInTable = (props: Props) => {
  const { userData, onDelete, onEdit } = props;

  return (
    <tr className="text-lg border-b border-gray-200 hover:bg-gray-100">
      <td className="text-center py-3 px-5 truncate">{userData.name}</td>
      <td className="text-left py-3 px-5 truncate">{userData.email}</td>
      <td className="text-center py-3 px-5 truncate">********</td>
      <td className="flex justify-center gap-5">
        <VscEdit
          className="mt-4 mx-0 text-xl cursor-pointer text-blue-500 hover:text-blue-700"
          type="button"
          onClick={onEdit}
        />
        <AiOutlineDelete
          className="mt-4 text-xl cursor-pointer text-red-500 hover:text-red-700"
          type="button"
          onClick={() => onDelete()}
        />
      </td>
    </tr>
  );
};
