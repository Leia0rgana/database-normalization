import React from 'react';
import './App.css';
import {
  FunctionalDependency,
  TableSchema as TableSchemaType,
} from './utils/types';
import { TableSchema } from './components/TableSchema';
import { useAppDispatch } from './redux/hooks';
import { clearSchema } from './redux/slices/tableSchemaSlice';
import { FunctionalDependencies } from './components/FunctionalDependencies';
import { clearFunctionalDependencies } from './redux/slices/functionalDependenciesSlice';
import { TableAttributes } from './components/TableAttributes';
import { Modal } from './components/UI/Modal';
import { TableDependecies } from './components/TableDependecies';
import { useNormalizeTableMutation } from './redux/api/tableSchemaApi';
import { NormalizationResult } from './components/NormalizationResult';
import { setError } from './redux/slices/errorSlice';
import { Sidebar } from './components/UI/Sidebar';

function App() {
  const [isTableFormShown, setIsTableFormShown] =
    React.useState<boolean>(false);
  const [isDependenciesFormShown, setIsDependenciesFormShown] =
    React.useState<boolean>(false);
  const [selectedTable, setSelectedTable] =
    React.useState<TableSchemaType | null>(null);
  const [dependencies, setDependencies] = React.useState<
    FunctionalDependency[] | null
  >();
  const [normalizationResult, setNormalizationResult] = React.useState<
    TableSchemaType[] | null
  >(null);

  const dispatch = useAppDispatch();

  const [normalizeTable, { isLoading }] = useNormalizeTableMutation();

  const handleTableFormClose = () => {
    dispatch(clearSchema());
    setIsTableFormShown(false);
  };

  const handleDependenciesFormClose = () => {
    dispatch(clearFunctionalDependencies());
    setIsDependenciesFormShown(false);
  };

  const handleNormalize = async () => {
    if (selectedTable) {
      try {
        const result = await normalizeTable(selectedTable).unwrap();
        setNormalizationResult(result);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch(setError('Не удалось нормализовать отношение'));
      }
    }
  };

  const handleCloseNormalizationResult = () => {
    setNormalizationResult(null);
  };

  return (
    <div className=" relative flex h-[85vh]">
      <Sidebar
        isTableFormShown={isTableFormShown}
        isDependenciesFormShown={isDependenciesFormShown}
        onTableFormShow={() => setIsTableFormShown(true)}
        onDependenciesFormShow={() => setIsDependenciesFormShown(true)}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />
      <div className="flex-1 pt-12 px-6 sm:p-6 overflow-y-auto">
        {selectedTable ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedTable.name}</h2>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNormalize}
                disabled={
                  !selectedTable || isLoading || dependencies?.length === 0
                }
              >
                {isLoading ? 'Нормализация...' : 'Нормализовать'}
              </button>
            </div>
            <TableAttributes tableInfo={selectedTable} />
            <TableDependecies
              tableInfo={selectedTable}
              onSetDependencies={setDependencies}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Выберите отношение, чтобы увидеть подробную информацию о нем
          </div>
        )}
      </div>
      {isTableFormShown && (
        <Modal label="Новое отношение">
          <TableSchema onCancelClick={handleTableFormClose} />
        </Modal>
      )}
      {isDependenciesFormShown && (
        <Modal label="Функциональные зависимости">
          <FunctionalDependencies onCancelClick={handleDependenciesFormClose} />
        </Modal>
      )}
      {normalizationResult && selectedTable && (
        <NormalizationResult
          originalTable={selectedTable}
          normalizedTables={normalizationResult}
          onClose={handleCloseNormalizationResult}
        />
      )}
    </div>
  );
}

export default App;
