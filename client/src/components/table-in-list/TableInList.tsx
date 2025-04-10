import React from 'react';
import style from './TableInList.module.css';
import { TableSchema } from '../../utils/types';

type TableProps = {
  tableInfo: TableSchema;
  onSelectItem?: (item: { tableName: string; attributeName: string }) => void;
  className?: string;
  isDropdown?: boolean;
};

export const TableInList = (props: TableProps) => {
  const { tableInfo, onSelectItem, className, isDropdown } = props;
  const [isAttributeListOpen, setIsAttributeListOpen] =
    React.useState<boolean>(false);

  return (
    <div
      className={className}
      onClick={() => setIsAttributeListOpen((prev) => !prev)}
    >
      <h5>{tableInfo?.name}</h5>
      {isAttributeListOpen && (
        <ul className={`${isDropdown ? style.attributeList : ''}`}>
          {tableInfo?.attributeList?.map((attribute, index) => (
            <li
              key={index}
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
