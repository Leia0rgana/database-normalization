import { TableSchema } from '../../utils/types';

type TableProps = {
  tableInfo: TableSchema;
  onSelectItem?: (item: { tableName: string; attributeName: string }) => void;
  className?: string;
  isDropdown?: boolean;
  isOpen: boolean;
  onToggleTable: (tableName: string) => void;
};

export const TableInList = (props: TableProps) => {
  const {
    tableInfo,
    onSelectItem,
    className,
    isDropdown,
    isOpen,
    onToggleTable,
  } = props;

  return (
    <div className={className} onClick={() => onToggleTable(tableInfo?.name)}>
      <h5 className="font-light">{tableInfo?.name}</h5>
      {isOpen && (
        <ul
          className={
            isDropdown
              ? 'absolute left-full top-0 z-100 flex flex-col min-w-[100px] font-light bg-white border border-gray-400 rounded'
              : ''
          }
        >
          {tableInfo?.attributeList?.map((attribute) => (
            <li
              key={attribute.name}
              className={className}
              onClick={() => {
                if (onSelectItem)
                  onSelectItem({
                    tableName: tableInfo.name,
                    attributeName: attribute.name,
                  });
              }}
            >
              {attribute.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
