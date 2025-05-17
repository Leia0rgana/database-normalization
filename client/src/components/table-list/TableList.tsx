import React from 'react';
import { useGetTableInfosQuery } from '../../redux/api/tableSchemaApi';
import { TableInList } from '../table-in-list';

type TableListProps = {
  onSelectItem?: (item: { tableName: string; attributeName: string }) => void;
  isDropdown?: boolean;
};

export const TableList = (props: TableListProps) => {
  // TODO universal component
  const { isDropdown, onSelectItem } = props;
  const { data = [], isLoading, isError, error } = useGetTableInfosQuery();
  const [openedTableName, setOpenedTableName] = React.useState<string | null>(
    null
  );

  const listItemStyles =
    'relative flex gap-1.5 justify-between border-b-[1px] border-gray-200 p-1 text-[#252b35] hover:bg-blue-400 hover:text-white hover:rounded';

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) {
    if ('status' in error) console.error(error.status);
    return <span>Ошибка при загрузке данных</span>;
  }

  return (
    <ul
      className={
        isDropdown
          ? 'absolute z-100 top-full left-0 flex flex-col min-w-[200px] bg-white border border-gray-400 rounded'
          : ''
      }
    >
      {isDropdown && (
        <li
          className={listItemStyles}
          onClick={() => {
            if (onSelectItem)
              onSelectItem({ tableName: '', attributeName: '---' });
          }}
        >
          ---
        </li>
      )}
      {data?.map((item) => (
        <TableInList
          key={item.name}
          tableInfo={item}
          className={isDropdown ? listItemStyles : ''}
          isDropdown={isDropdown}
          onSelectItem={onSelectItem}
          isOpen={openedTableName === item.name}
          onToggleTable={(tableName) =>
            setOpenedTableName(tableName === openedTableName ? null : tableName)
          }
        />
      ))}
    </ul>
  );
};
