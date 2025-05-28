import React from 'react';
import { useGetTableInfosQuery } from '../redux/api/tableSchemaApi';
import { TableInList } from './TableInList';
import { ImSpinner2 } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { setError } from '../redux/slices/errorSlice';
import { TableSchema } from '../utils/types';

type TableListProps = {
  onSelectItem?: (item: { tableName: string; attributeName: string }) => void;
  onTableSelect?: (tableInfo: TableSchema) => void;
  isDropdown?: boolean;
  selectedTable?: string | null;
};

export const TableList = (props: TableListProps) => {
  const { isDropdown, onSelectItem, onTableSelect, selectedTable } = props;
  const { data: tableInfos = [], isLoading, isError } = useGetTableInfosQuery();
  const [openedTableName, setOpenedTableName] = React.useState<string | null>(
    null
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isError) {
      dispatch(setError('Не удалось получить данные о таблицах'));
    }
  }, [dispatch, isError]);

  const listItemStyles = (isSelected: boolean) =>
    `relative flex gap-1.5 justify-between border-b-[1px] border-gray-200 p-2 text-[#252b35] hover:bg-blue-400 hover:text-white hover:rounded cursor-pointer ${
      isSelected ? 'bg-blue-500 text-white rounded' : ''
    }`;

  const handleTableClick = (tableInfo: TableSchema) => {
    if (isDropdown) {
      setOpenedTableName(
        tableInfo.name === openedTableName ? null : tableInfo.name
      );
    }
    if (onTableSelect) {
      onTableSelect(tableInfo);
    }
  };

  return (
    <ul
      className={
        isDropdown
          ? 'absolute z-100 top-full left-0 flex flex-col min-w-[200px] bg-white border border-gray-400 rounded'
          : 'flex flex-col'
      }
    >
      {isLoading && <ImSpinner2 className="spinner self-center p-2 m-2" />}
      {isDropdown && !isLoading && (
        <li
          className={listItemStyles(false)}
          onClick={() => {
            if (onSelectItem)
              onSelectItem({ tableName: '', attributeName: '---' });
          }}
        >
          ---
        </li>
      )}
      {tableInfos?.map((tableInfo) => (
        <TableInList
          key={tableInfo.name}
          tableInfo={tableInfo}
          className={listItemStyles(selectedTable === tableInfo.name)}
          isDropdown={isDropdown}
          onSelectItem={onSelectItem}
          isOpen={isDropdown ? openedTableName === tableInfo.name : false}
          onToggleTable={handleTableClick}
        />
      ))}
    </ul>
  );
};
