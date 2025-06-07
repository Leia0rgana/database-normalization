import React from 'react';
import { AttributeForm } from './AttributeForm';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setTableName,
  selectAttributeList,
  selectTableName,
} from '../redux/slices/tableSchemaSlice';
import { AttributeList } from './AttributeList';
import { useCreateTableInfoMutation } from '../redux/api/tableSchemaApi';
import { setError } from '../redux/slices/errorSlice';

type Props = {
  onCancelClick: () => void;
};

export const TableSchema = (props: Props) => {
  const { onCancelClick } = props;

  const [tableValue, setTableValue] = React.useState<string>('');
  const dispatch = useAppDispatch();
  const attributeListSelector = useAppSelector(selectAttributeList);
  const tableNameSelector = useAppSelector(selectTableName);

  const [createTableInfo] = useCreateTableInfoMutation();

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    const tableName = tableValue.trim();
    if (tableName.trim() === '') {
      dispatch(setTableName(''));
    } else {
      dispatch(setTableName(tableName));
    }
  };

  const handleConfirm: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    await createTableInfo({
      name: tableNameSelector,
      attributeList: attributeListSelector,
    })
      .unwrap()
      .then(() => {
        setTableValue('');
      })
      .catch(() => {
        dispatch(setError('Не удалось добавить информацию об отношении'));
      });

    if (typeof onCancelClick === 'function') onCancelClick();
  };

  return (
    <div className="flex flex-col gap-4 items-start w-fit p-6 my-4 rounded-lg shadow-lg border border-gray-300">
      <span className="flex flex-col gap-2">
        <label htmlFor="tableName" className="font-medium">
          Название
        </label>
        <input
          type="text"
          name="tableName"
          value={tableValue}
          onChange={(e) => setTableValue(e.target.value)}
          onBlur={handleBlur}
          className="px-3 py-2 font-normal border border-gray-200 rounded transition-all duration-200"
        />
      </span>
      <div className="font-medium">
        Атрибуты
        <div className="flex flex-col gap-3 font-normal bg-gray-50 border border-gray-200 rounded-lg p-4 my-2 w-full box-border ">
          <AttributeForm />
          <AttributeList />
        </div>
      </div>
      <span className="flex self-end gap-3">
        <button
          onClick={handleConfirm}
          disabled={attributeListSelector.length === 0 || !tableNameSelector}
          className="btn-primary"
        >
          OK
        </button>
        <button onClick={onCancelClick} className="btn-secondary">
          Отмена
        </button>
      </span>
    </div>
  );
};
