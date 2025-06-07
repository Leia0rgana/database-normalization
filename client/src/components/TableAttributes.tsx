import { TableSchema } from '../utils/types';
import { Attribute } from './Attribute';

type TableAttributesProps = {
  tableInfo: TableSchema;
};

export const TableAttributes = (props: TableAttributesProps) => {
  const { tableInfo } = props;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Атрибуты:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tableInfo.attributeList.map((attribute) => (
          <Attribute
            key={attribute.name}
            attribute={attribute}
            className="p-3 bg-gray-50 rounded border border-gray-200 font-medium"
            readonly
          />
        ))}
      </div>
    </div>
  );
};
