import style from './TableList.module.css';
import { useGetTableInfosQuery } from '../../redux/tableSchemaApi';
import { TableInList } from '../table-in-list';

type TableListProps = {
  onSelectItem?: (item: { tableName: string; attributeName: string }) => void;
  isDropdown?: boolean;
};

export const TableList = (props: TableListProps) => {
  const { isDropdown, onSelectItem } = props;
  const { data = [], isLoading, isError } = useGetTableInfosQuery();

  if (isError) return <div>An error has occurred!</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <ul className={`${isDropdown ? style.dropdownList : ''}`}>
      {isDropdown && (
        <li
          className={style.dropdownListItem}
          onClick={() => {
            console.log('TABLE LIST');
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
          className={`${isDropdown ? style.dropdownListItem : ''}`}
          isDropdown={isDropdown}
          onSelectItem={onSelectItem}
        />
      ))}
    </ul>
  );
};
