import style from './TableInList.module.css';
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
      <h5>{tableInfo?.name}</h5>
      {isOpen && (
        <ul className={`${isDropdown ? style.attributeList : ''}`}>
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
