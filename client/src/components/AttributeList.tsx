import { useAppSelector } from '../redux/hooks';
import { selectAttributeList } from '../redux/slices/tableSchemaSlice';
import { Attribute } from './Attribute';

export const AttributeList = () => {
  const attributeListSelector = useAppSelector(selectAttributeList);

  return (
    <>
      {attributeListSelector.length !== 0 ? (
        <ul className="flex flex-col w-fit p-0">
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
