import React from 'react';
import style from './AttributeForm.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectAttributeList,
  addAttributeToTable,
} from '../../redux/slices/tableSchemaSlice';
import { TableDropdown } from '../table-dropdown';
import { ForeignKeyReference } from '../../utils/types';
import { VscKey } from 'react-icons/vsc';

export const AttributeForm = () => {
  const [name, setName] = React.useState<string>('');
  const [isPrimaryKey, setIsPrimaryKey] = React.useState<boolean>(false);
  const [foreignKeyReference, setForeignKeyReference] = React.useState<
    ForeignKeyReference | undefined
  >();

  const dispatch = useAppDispatch();
  const attributeListSelector = useAppSelector(selectAttributeList);

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  const handleCheckbox: React.ChangeEventHandler<HTMLInputElement> = () => {
    setIsPrimaryKey(!isPrimaryKey);
  };

  const handleAdd: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const isUnique = !attributeListSelector.find((item) => item.name === name);

    if (isUnique) {
      dispatch(
        addAttributeToTable({
          name: name,
          isPrimaryKey,
          foreignKeyReference: foreignKeyReference,
        })
      );
    } else {
      console.log('element already exists'); // todo throw error
    }

    setName('');
    setIsPrimaryKey(false);
  };

  return (
    <div className={style.formContainer}>
      <form className={style.attributeForm}>
        <span className={style.formGroup}>
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
            className="border p-1"
          />
        </span>
        <span className={style.formGroup}>
          <label htmlFor="isPrimaryKey">
            <VscKey className={style.primaryKeyIcon} title="Первичный ключ" />
          </label>
          <input
            type="checkbox"
            name="isPrimaryKey"
            checked={isPrimaryKey}
            onChange={handleCheckbox}
            className="h-5"
          />
        </span>
        <span className={style.formGroup}>
          <label htmlFor="type">
            <VscKey className={style.foreignKeyIcon} title="Внешний ключ" />
          </label>
          <TableDropdown setForeignKeyReference={setForeignKeyReference} />
        </span>
      </form>
      <button
        className={`${style.formButton}`}
        onClick={handleAdd}
        disabled={!name}
      >
        Добавить
      </button>
    </div>
  );
};
