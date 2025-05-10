import React from 'react';
import { AttributeForm } from '../attribute-form';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  setTableName,
  clearSchema,
  selectAttributeList,
  selectTableName,
} from '../../redux/slices/tableSchemaSlice';
import { AttributeList } from '../attribute-list';
import { useCreateTableInfoMutation } from '../../redux/api/tableSchemaEndpoints';

type Props = {
  onCancelClick: React.MouseEventHandler<HTMLButtonElement>;
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
        dispatch(clearSchema());
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex flex-col gap-4 items-start w-fit p-6 my-4 rounded-lg bg-white shadow-lg border border-gray-200">
      <span className="flex flex-col gap-2">
        <label htmlFor="tableName" className="font-medium">
          Таблица
        </label>
        <input
          type="text"
          name="tableName"
          value={tableValue}
          onChange={(e) => setTableValue(e.target.value)}
          onBlur={handleBlur}
          className="px-3 py-2 border border-gray-200 rounded transition-all duration-200"
        />
      </span>
      <div className="font-medium">
        Атрибуты
        <div className="flex flex-col gap-3 border border-gray-200 rounded-lg p-4 my-2 w-full box-border ">
          <AttributeForm />
          <AttributeList />
        </div>
      </div>
      <span className="flex self-end gap-3">
        <button
          onClick={handleConfirm}
          disabled={attributeListSelector.length === 0 || !tableNameSelector}
          className="px-4 py-2 rounded font-medium cursor-pointer transition-all duration-200 border-none bg-blue-400 text-white disabled:bg-blue-200 disabled:cursor-not-allowed hover:enabled:bg-blue-500"
        >
          OK
        </button>
        <button
          onClick={onCancelClick}
          className="px-4 py-2 rounded font-medium cursor-pointer transition-all duration-200 bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
        >
          Отмена
        </button>
      </span>
    </div>
  );
};
