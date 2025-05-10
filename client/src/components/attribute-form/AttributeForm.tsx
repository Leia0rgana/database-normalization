import React from 'react';
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
  const [dropdownLabel, setDropdownLabel] = React.useState<string>('---');

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
    setDropdownLabel('---');
    setForeignKeyReference(undefined);
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <form className="flex flex-row items-start gap-3 flex-wrap w-full">
        <span className="flex flex-col gap-2">
          <label htmlFor="name" className="flex items-center text-sm">
            Имя
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
            className="px-3 py-2 border border-gray-200 rounded transition-all duration-200 min-w-[200px]"
          />
        </span>
        <span className="flex flex-col gap-2">
          <label htmlFor="isPrimaryKey">
            <VscKey
              className="text-xl text-yellow-400 cursor-help"
              title="Первичный ключ"
            />
          </label>
          <input
            type="checkbox"
            name="isPrimaryKey"
            checked={isPrimaryKey}
            onChange={handleCheckbox}
            className="h-10 cursor-pointer"
          />
        </span>
        <span className="flex flex-col gap-2">
          <label htmlFor="foreignKey">
            <VscKey
              className="text-xl text-gray-500 cursor-help"
              title="Внешний ключ"
            />
          </label>
          <TableDropdown
            label={dropdownLabel}
            onSetLabel={setDropdownLabel}
            onSetForeignKey={setForeignKeyReference}
          />
        </span>
      </form>
      <button
        className="self-end px-4 py-2 rounded font-medium transition-all duration-200 bg-blue-400 text-white disabled:bg-blue-200 disabled:cursor-not-allowed hover:enabled:bg-blue-500"
        onClick={handleAdd}
        disabled={!name}
      >
        Добавить
      </button>
    </div>
  );
};
