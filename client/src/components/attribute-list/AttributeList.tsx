import style from './AttributeList.module.css';
import { useAppSelector } from '../../redux/hooks';
import { selectAttributeList } from '../../redux/slices/tableSchemaSlice';
import { Attribute } from '../attribute';

export const AttributeList = () => {
  const attributeListSelector = useAppSelector(selectAttributeList);

  return (
    <>
      {attributeListSelector.length !== 0 ? (
        <ul className={style.attributeList}>
          {attributeListSelector.map((attribute) => (
            <Attribute key={attribute.name} attribute={attribute} />
          ))}
        </ul>
      ) : (
        <div className="italic text-xs">Список атрибутов пуст</div>
      )}
    </>
  );
};
