import React from 'react';
import { AttributeForm } from '../attribute-form';
import style from './TableSchema.module.css';
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
    <div className={style.tableSchemaContainer}>
      <span className={style.tableGroup}>
        <label htmlFor="tableName" className="font-medium!">
          Таблица
        </label>
        <input
          type="text"
          name="tableName"
          value={tableValue}
          onChange={(e) => setTableValue(e.target.value)}
          onBlur={handleBlur}
          className="border p-1"
        />
      </span>
      <div className="font-medium!">
        Атрибуты
        <div className={style.attributeContainer}>
          <AttributeForm />
          <AttributeList />
        </div>
      </div>
      <span className={style.buttonGroup}>
        <button
          onClick={handleConfirm}
          disabled={attributeListSelector.length === 0 || !tableNameSelector}
        >
          OK
        </button>
        <button onClick={onCancelClick}>Отмена</button>
      </span>
    </div>
  );
};
