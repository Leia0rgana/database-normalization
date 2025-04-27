import React from 'react';
import './App.css';
import { TableSchema } from './components/table-schema';
import { useAppDispatch } from './redux/hooks';
import { clearSchema } from './redux/slices/tableSchemaSlice';
import { TableList } from './components/table-list';
import { FunctionalDependencies } from './components/functional-dependencies';
import { clearFunctionalDependencies } from './redux/slices/functionalDependenciesSlice';

function App() {
  const [isTableFormShown, setIsTableFormShown] =
    React.useState<boolean>(false);
  const [isDependenciesFormShown, setIsDependenciesFormShown] =
    React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleTableFormClose: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    dispatch(clearSchema());
    setIsTableFormShown(false);
  };

  const handleDependenciesFormClose: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    dispatch(clearFunctionalDependencies());
    setIsDependenciesFormShown(false);
  };
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between items-start">
        <div className="font-medium! text-base text-[#4a5568]">
          Добавить таблицу{' '}
          <button
            className="addButton"
            onClick={() => setIsTableFormShown(true)}
          >
            +
          </button>
          {isTableFormShown && (
            <TableSchema onCancelClick={handleTableFormClose} />
          )}
        </div>
        <div>
          <button
            className="addButton"
            onClick={() => setIsDependenciesFormShown(!isDependenciesFormShown)}
          >
            {isDependenciesFormShown ? 'Скрыть ФЗ' : 'Показать ФЗ'}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <TableList />
        {isDependenciesFormShown && (
          <FunctionalDependencies onCancelClick={handleDependenciesFormClose} />
        )}
      </div>
    </div>
  );
}

export default App;
