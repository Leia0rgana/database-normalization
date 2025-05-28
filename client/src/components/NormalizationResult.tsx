import { TableSchema } from '../utils/types';

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

          {/* Исходная таблица */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Исходное отношение: {originalTable.name}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Атрибуты:</h4>
                  <ul className="space-y-1">
                    {originalTable.attributeList.map((attr) => (
                      <li
                        key={attr.name}
                        className="flex items-center space-x-2 text-gray-700"
                      >
                        <span>{attr.name}</span>
                        {attr.isPrimaryKey && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            PK
                          </span>
                        )}
                        {attr.foreignKeyReference && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            FK
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
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
              </div>
            </div>
          </div>

          {/* Результаты нормализации */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Отношения после нормализации:
            </h3>
            <div className="space-y-6">
              {normalizedTables.map((table) => (
                <div
                  key={table.name}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-gray-800">
                      {table.name}
                    </h4>
                    {table.name !== originalTable.name && (
                      <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                        Новое отношение
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-600 mb-2">
                        Атрибуты:
                      </h5>
                      <ul className="space-y-1">
                        {table.attributeList.map((attr) => (
                          <li
                            key={attr.name}
                            className="flex items-center space-x-2 text-gray-700"
                          >
                            <span>{attr.name}</span>
                            {attr.isPrimaryKey && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                PK
                              </span>
                            )}
                            {attr.foreignKeyReference && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                FK
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* <div>
                      <h5 className="font-medium text-gray-600 mb-2">
                        Функциональные зависимости:
                      </h5>
                      <ul className="space-y-2">
                        {table.functionalDependencies.map((fd, index) => (
                          <li key={index} className="text-gray-700">
                            {fd.determinant.join(', ')} →{' '}
                            {fd.dependent.join(', ')}
                          </li>
                        ))}
                      </ul>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
