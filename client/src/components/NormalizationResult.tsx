import { TableSchema } from '../utils/types';
import { TableInNormalizationResult } from './TableInNormalizationResult';

type Props = {
  originalTable: TableSchema;
  normalizedTables: TableSchema[];
  onClose: () => void;
};

export const NormalizationResult = (props: Props) => {
  const { originalTable, normalizedTables, onClose } = props;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Результаты нормализации
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <TableInNormalizationResult
            className="mb-8"
            table={originalTable}
            label="Исходное отношение"
          />
          {/* <div>
                  <h4 className="font-medium text-gray-600 mb-2">
                    Функциональные зависимости:
                  </h4>
                  <ul className="space-y-2">
                    {originalTable.functionalDependencies.map((fd, index) => (
                      <li key={index} className="text-gray-700">
                        {fd.determinant.join(', ')} → {fd.dependent.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div> */}

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Отношения после нормализации:
            </h3>
            <div className="space-y-6">
              {normalizedTables.map((table) => (
                <TableInNormalizationResult
                  key={table.name}
                  table={table}
                  label="Новое отношение"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
