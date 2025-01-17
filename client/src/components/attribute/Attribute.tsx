import style from './Attribute.module.css';

type AttributeProps = {
  attribute: {
    name: string;
    type: string;
    isPrimaryKey: boolean;
  };
};

export const Attribute = (props: AttributeProps) => {
  const { name, type, isPrimaryKey } = props.attribute;
  return (
    <li className={style.attribute}>
      <h5>{name}</h5>
      <p>{type}</p>
      {isPrimaryKey && <p>Первичный ключ</p>}
    </li>
  );
};
