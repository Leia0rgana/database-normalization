import React from 'react';
import style from './AttributeForm.module.css';
import { useAppDispatch } from '../../redux/hooks';
import { setAttributeList } from '../../redux/slices/attributeListSlice';

export const AttributeForm = () => {
  const [name, setName] = React.useState<string>('');
  const [type, setType] = React.useState<string>('int');
  const [isPrimaryKey, setIsPrimaryKey] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  const handleCheckbox: React.ChangeEventHandler<HTMLInputElement> = () => {
    setIsPrimaryKey(!isPrimaryKey);
  };

  const handleSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setType(e.target.value);
  };

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setName('');
    setType('int');
    setIsPrimaryKey(false);

    dispatch(
      setAttributeList({
        name: name,
        type: type,
        isPrimaryKey,
      })
    );
  };

  return (
    <>
      <form className={style.attributeForm}>
        <span className={style.formGroup}>
          <label htmlFor="name">Название</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
            className=""
          />
        </span>
        <span className={style.formGroup}>
          <label htmlFor="type">Тип</label>
          <select
            name="type"
            onChange={handleSelect}
            className=" "
            value={type}
          >
            <option value="int">INTEGER</option>
            <option value="text">TEXT</option>
          </select>
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
      </form>
      <button onClick={handleSubmit}>Добавить</button>
    </>
  );
};
