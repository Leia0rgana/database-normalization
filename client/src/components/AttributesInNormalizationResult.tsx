import { Attribute } from '../utils/types';

type Props = {
  attributes: Attribute[];
};
export const AttributesInNormalizationResult = (props: Props) => {
  const { attributes } = props;
  return (
    <ul className="space-y-1">
      {attributes.map((attr) => (
        <li
          key={attr.name}
          className="flex items-center space-x-2 text-gray-700"
        >
          <span>{attr.name}</span>
          {attr.isPrimaryKey && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              ПК
            </span>
          )}
          {attr.foreignKeyReference && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
              ВК
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};
