import { useAppDispatch } from '../redux/hooks';
import { MdClear } from 'react-icons/md';
import { VscKey } from 'react-icons/vsc';
import { removeAttributeFromTable } from '../redux/slices/tableSchemaSlice';
import { Attribute as AttributeType } from '../utils/types';

type AttributeProps = {
  attribute: AttributeType;
  className?: string;
  readonly?: boolean;
};

export const Attribute = (props: AttributeProps) => {
  const { attribute, className, readonly } = props;
  const dispatch = useAppDispatch();

  const handleClick = (name: string) => {
    dispatch(removeAttributeFromTable(name));
  };

  return (
    <li className={`flex flex-row gap-1.5 items-center ${className}`}>
      {!readonly && (
        <MdClear
          className=" text-gray-500 hover:text-gray-700"
          onClick={() => handleClick(attribute.name)}
        />
      )}
      <h5 className="truncate">{attribute.name}</h5>
      {attribute.isPrimaryKey && (
        <VscKey
          className="text-lg text-yellow-400 ml-1 cursor-help"
          title="Первичный ключ"
        />
      )}
      {attribute.foreignKeyReference && (
        <>
          <VscKey
            className="text-lg text-gray-500 ml-1 cursor-help"
            title={`Внешний ключ ${attribute.foreignKeyReference.attributeName} из таблицы ${attribute.foreignKeyReference.tableName}`}
          />
        </>
      )}
    </li>
  );
};
