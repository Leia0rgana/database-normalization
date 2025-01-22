import React from 'react';
import style from './AttributeForm.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectAttributeList,
  setAttributeList,
} from '../../redux/slices/tableSchemaSlice';
// import { Dropdown } from '../UI/dropdown';

// type AttributeFormProps = {
//   setIsFormShown: (item: boolean) => void;
// };

export const AttributeForm = () => {
  const [name, setName] = React.useState<string>('');
  const [isPrimaryKey, setIsPrimaryKey] = React.useState<boolean>(false);
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
        setAttributeList({
          name: name,
          isPrimaryKey,
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
            className=""
          />
        </span>
        <span className={style.formGroup}>
          <label htmlFor="isPrimaryKey">ПК</label>
          <input
            type="checkbox"
            name="isPrimaryKey"
            checked={isPrimaryKey}
            onChange={handleCheckbox}
          />
        </span>
        <span className={style.formGroup}>
          <label htmlFor="type">ВК</label>
          {/* <Dropdown list={list} /> */}
        </span>
      </form>
      <button className={style.formButton} onClick={handleAdd} disabled={!name}>
        Добавить
      </button>
    </div>
  );
};
