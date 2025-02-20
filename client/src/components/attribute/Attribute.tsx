import { useAppDispatch } from '../../redux/hooks';
import style from './Attribute.module.css';
import { MdClear } from 'react-icons/md';
import { removeAttributeFromList } from '../../redux/slices/tableSchemaSlice';

type AttributeProps = {
  attribute: {
    name: string;
    isPrimaryKey: boolean;
  };
};

export const Attribute = (props: AttributeProps) => {
  const { attribute } = props;
  const dispatch = useAppDispatch();

  const handleClick = (name: string) => {
    dispatch(removeAttributeFromList(name));
  };

  return (
    <li className={style.attribute}>
      <MdClear onClick={() => handleClick(attribute.name)} />
      <h5>{attribute.name}</h5>
      {attribute.isPrimaryKey && <p>(ПК)</p>}
    </li>
  );
};
