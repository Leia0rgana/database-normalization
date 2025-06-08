import React from 'react';
import './App.css';
import {
  FunctionalDependency,
  TableSchema as TableSchemaType,
} from './utils/types';
import { TableSchema } from './components/TableSchema';
import { useAppDispatch } from './redux/hooks';
import { FunctionalDependencies } from './components/FunctionalDependencies';
import { TableAttributes } from './components/TableAttributes';
import { Modal } from './components/UI/Modal';
import { TableDependecies } from './components/TableDependecies';
import { useNormalizeTableMutation } from './redux/api/tableSchemaApi';
import { NormalizationResult } from './components/NormalizationResult';
import { setError, setInfo } from './redux/slices/messageSlice';
import { Sidebar } from './components/UI/Sidebar';
import { VscEdit } from 'react-icons/vsc';
import { AiOutlineDelete } from 'react-icons/ai';
import { DeleteTable } from './components/DeleteTable';

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
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const dispatch = useAppDispatch();

  const [normalizeTable, { isLoading }] = useNormalizeTableMutation();

  const handleNormalize = async () => {
    if (selectedTable) {
      try {
        const result = await normalizeTable(selectedTable).unwrap();

        if (result.length > 1) setNormalizationResult(result);
        else {
          setNormalizationResult(null);
          dispatch(setInfo('Отношение уже нормализовано'));
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch(setError('Не удалось нормализовать отношение'));
      }
    }
  };

  return (
    <div className="flex h-[85vh]">
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
            <div className="flex flex-col gap-3 md:flex-row justify-between items-center">
              <span className="flex gap-2 items-center ">
                <h2 className="text-xl font-semibold">{selectedTable.name}</h2>
                <VscEdit
                  className="text-xl cursor-pointer text-gray-500 hover:scale-120 transition-all ease-in-out duration-200"
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                />
                <AiOutlineDelete
                  className="text-xl cursor-pointer text-gray-500 hover:scale-120 transition-all ease-in-out duration-200"
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                />
              </span>
              {selectedTable.normalized ? (
                <div className="bg-[#CF881B] text-white px-4 py-2 rounded text-center truncate">
                  Отношение нормализовано
                </div>
              ) : (
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleNormalize}
                  disabled={
                    !selectedTable || isLoading || dependencies?.length === 0
                  }
                >
                  {isLoading ? 'Нормализация...' : 'Нормализовать'}
                </button>
              )}
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
          <TableSchema onCancelClick={() => setIsTableFormShown(false)} />
        </Modal>
      )}
      {isDependenciesFormShown && (
        <Modal label="Функциональные зависимости">
          <FunctionalDependencies
            onCancelClick={() => {
              setIsDependenciesFormShown(false);
            }}
          />
        </Modal>
      )}
      {normalizationResult && selectedTable && (
        <NormalizationResult
          originalTable={selectedTable}
          normalizedTables={normalizationResult}
          onClose={() => setNormalizationResult(null)}
        />
      )}
      {isEditModalOpen && (
        <Modal label="Редактировать отношение">
          <TableSchema
            editMode
            initialTable={selectedTable}
            onCancelClick={() => setEditModalOpen(false)}
          />
        </Modal>
      )}
      {isDeleteModalOpen && (
        <Modal label="Удаление">
          <DeleteTable
            tableInfo={selectedTable}
            onCancelClick={() => setDeleteModalOpen(false)}
            onDeleted={() => setSelectedTable(null)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
