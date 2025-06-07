import { TableSchema } from '../utils/types';
import { AttributesInNormalizationResult } from './AttributesInNormalizationResult';

type Props = {
  table: TableSchema;
  label: string;
  className?: string;
};

export const TableInNormalizationResult = (props: Props) => {
  const { table, label, className } = props;

  return (
    <div
      key={table.name}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row items-start sm:items-center justify-between mb-3">
        <h4 className="te xt-lg font-medium text-gray-800">{table.name}</h4>
        <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
          {label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium text-gray-600 mb-2">Атрибуты:</h5>
          <AttributesInNormalizationResult attributes={table.attributeList} />
        </div>
      </div>
    </div>
  );
};
