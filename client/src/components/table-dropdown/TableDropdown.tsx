import React from 'react';
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
    <div className="relative flex gap-1" ref={dropdownRef}>
      <button
        className="flex items-center justify-between gap-1.5 w-[200px] min-h-[21px] px-3 py-2 border border-gray-200 rounded after:content-[''] after:border-solid after:border-black after:border-r-2 after:border-b-2 after:inline-block after:p-0.5 after:rotate-45"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        {label}
      </button>
      {isOpen && <TableList onSelectItem={handleSelect} isDropdown />}
    </div>
  );
};
