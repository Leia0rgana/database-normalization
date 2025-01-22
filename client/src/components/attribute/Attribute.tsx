import style from './Attribute.module.css';

type AttributeProps = {
  attribute: {
    name: string;
    isPrimaryKey: boolean;
  };
};

export const Attribute = (props: AttributeProps) => {
  const { name, isPrimaryKey } = props.attribute;
  return (
    <li className={style.attribute}>
      <h5>{name}</h5>
      {isPrimaryKey && <p>первичный ключ</p>}
    </li>
  );
};
