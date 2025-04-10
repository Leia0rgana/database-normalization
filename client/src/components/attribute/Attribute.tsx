import { useAppDispatch } from '../../redux/hooks';
import style from './Attribute.module.css';
import { MdClear } from 'react-icons/md';
import { VscKey } from 'react-icons/vsc';
import { removeAttributeFromTable } from '../../redux/slices/tableSchemaSlice';

type AttributeProps = {
  attribute: {
    name: string;
    isPrimaryKey: boolean;
    foreignKeyReference?: {
      attributeName: string;
      tableName: string;
    };
  };
};

export const Attribute = (props: AttributeProps) => {
  const { attribute } = props;
  const dispatch = useAppDispatch();

  const handleClick = (name: string) => {
    dispatch(removeAttributeFromTable(name));
  };

  return (
    <li className={style.attribute}>
      <MdClear
        className={style.clearIcon}
        onClick={() => handleClick(attribute.name)}
      />
      <h5>{attribute.name}</h5>
      {attribute.isPrimaryKey && (
        <VscKey className={style.primaryKey} title="Первичный ключ" />
      )}
      {attribute.foreignKeyReference && (
        <>
          <VscKey
            className={style.foreignKey}
            title={`Внешний ключ ${attribute.foreignKeyReference.attributeName} из таблицы ${attribute.foreignKeyReference.tableName}`}
          />
        </>
      )}
    </li>
  );
};
