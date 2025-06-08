import { useDeleteTableMutation } from '../redux/api/tableSchemaApi';
import { useAppDispatch } from '../redux/hooks';
import { setError } from '../redux/slices/messageSlice';
import { TableSchema } from '../utils/types';

type Props = {
  onCancelClick: () => void;
  tableInfo: TableSchema | null;
  onDeleted?: () => void;
};

export const DeleteTable = (props: Props) => {
  const { onCancelClick, tableInfo, onDeleted } = props;
  const dispatch = useAppDispatch();

  const [deleteTable] = useDeleteTableMutation();

  const handleDeleteClick = async () => {
    if (tableInfo?._id)
      await deleteTable(tableInfo._id)
        .unwrap()
        .then(() => {
          if (onDeleted) onDeleted();
          onCancelClick();
        })
        .catch(() => {
          onCancelClick();
          dispatch(setError('Не удалось удалить отоношение'));
        });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        Вы уверены, что хотите удалить отношение {tableInfo?.name}?
        <br /> Это действие нельзя отменить
      </div>
      <span className="flex justify-center gap-5">
        <button className="btn-primary" onClick={handleDeleteClick}>
          OK
        </button>
        <button className="btn-secondary" onClick={onCancelClick}>
          Отмена
        </button>
      </span>
    </div>
  );
};
