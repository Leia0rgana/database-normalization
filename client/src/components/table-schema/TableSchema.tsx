import React from 'react';
import { AttributeForm } from '../attribute-form';
import style from './TableSchema.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  setTableName,
  selectAttributeList,
  selectTableName,
} from '../../redux/slices/tableSchemaSlice';
import { AttributeList } from '../attribute-list';
import { useCreateTableInfoMutation } from '../../redux/tableSchemaApi';

type Props = {
  handleCancelClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const TableSchema = (props: Props) => {
  const { handleCancelClick } = props;

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
      .then((payload) => console.log(payload))
      .catch((error) => console.log(error));
  };

  return (
    <div className={style.tableSchemaContainer}>
      <span className={style.tableGroup}>
        <label htmlFor="tableName">Таблица</label>
        <input
          type="text"
          name="tableName"
          value={tableValue}
          onChange={(e) => setTableValue(e.target.value)}
          onBlur={handleBlur}
        />
      </span>
      <div>
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
        <button onClick={handleCancelClick}>Отмена</button>
      </span>
    </div>
  );
};
