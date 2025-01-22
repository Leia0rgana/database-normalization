import React from 'react';
import { AttributeForm } from '../attribute-form';
import style from './TableSchema.module.css';
import { useAppDispatch } from '../../redux/hooks';
import { setTableName } from '../../redux/slices/tableSchemaSlice';
import { AttributeList } from '../attribute-list';

export const TableSchema = () => {
  const [tableValue, setTableValue] = React.useState<string>('');
  const dispatch = useAppDispatch();

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    const tableName = tableValue.trim();
    if (tableName.trim() == '') {
      dispatch(setTableName(''));
    } else {
      dispatch(setTableName(tableName));
    }
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
    </div>
  );
};
