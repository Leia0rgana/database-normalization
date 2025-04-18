import React from 'react';
import style from './TableDropdown.module.css';
import { TableList } from '../table-list';
import { useClickOutside } from '../../hooks/useClickOutside';
import { ForeignKeyReference } from '../../utils/types';

type TableDropdownProps = {
  label: string;
  onSetLabel: (label: string) => void;
  onSetForeignKey: (item: ForeignKeyReference | undefined) => void;
};

export const TableDropdown = (props: TableDropdownProps) => {
  const { label, onSetLabel, onSetForeignKey } = props;

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const closeDropdown = React.useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRef, closeDropdown);

  const handleSelect = (item: { tableName: string; attributeName: string }) => {
    if (label === item.attributeName || item.attributeName === '---') {
      onSetLabel('---');
      onSetForeignKey(undefined);
    } else {
      onSetLabel(`${item.attributeName} (${item.tableName})`);
      onSetForeignKey(item);
    }
    setIsOpen(false);
  };

  return (
    <div className={style.dropdownContainer} ref={dropdownRef}>
      <button
        className={style.dropdownButton}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        {label}
      </button>
      {isOpen && <TableList onSelectItem={handleSelect} isDropdown />}
    </div>
  );
};
