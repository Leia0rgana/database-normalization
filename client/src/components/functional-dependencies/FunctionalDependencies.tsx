import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  addFunctionalDependency,
  clearFunctionalDependencies,
  selectFunctionalDependencies,
  type FunctionalDependency,
} from '../../redux/slices/functionalDependenciesSlice';
import { useGetTableInfosQuery } from '../../redux/api/tableSchemaApi';
import { useAddFunctionalDependenciesMutation } from '../../redux/api/functionalDependenciesApi';
import { AttributesInFD } from '../attributes-in-fd';
import { Attribute } from '../../utils/types';
import { DependenciesList } from '../dependencies-list';
import { setError } from '../../redux/slices/errorSlice';
import { ErrorNotification } from '../UI/ErrorNotification';

type Props = {
  onCancelClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const FunctionalDependencies = (props: Props) => {
  // TODO split into several components
  const { onCancelClick } = props;

  const [selectedTable, setSelectedTable] = React.useState<string>('');
  const [selectedDeterminant, setSelectedDeterminant] = React.useState<
    Attribute[]
  >([]);
  const [selectedDependent, setSelectedDependent] = React.useState<Attribute[]>(
    []
  );
  const dependenciesSelector = useAppSelector(selectFunctionalDependencies);

  const dispatch = useAppDispatch();

  const { data: tables = [], isLoading, isError } = useGetTableInfosQuery();
  const [addFDs] = useAddFunctionalDependenciesMutation();

  React.useEffect(() => {
    if (isError) {
      dispatch(setError('Не удалось получить данные о таблицах'));
    }
  }, [dispatch, isError]);

  const selectedTableAttributes = React.useMemo(() => {
    if (!selectedTable) return [];

    const table = tables.find((t) => t.name === selectedTable);

    return table?.attributeList || [];
  }, [selectedTable, tables]);

  const handleAddDependency = () => {
    if (
      selectedTable &&
      selectedDeterminant.length > 0 &&
      selectedDependent.length > 0
    ) {
      const selectedDeterminantNames = selectedDeterminant.map(
        (attribute) => attribute.name
      );
      const selectedDependentNames = selectedDependent.map(
        (attribute) => attribute.name
      );

      const newFD: FunctionalDependency = {
        id: crypto.randomUUID(),
        determinant: selectedDeterminantNames,
        dependent: selectedDependentNames,
        tableName: selectedTable,
      };

      dispatch(addFunctionalDependency(newFD));

      setSelectedDeterminant([]);
      setSelectedDependent([]);
    }
  };

  const handleConfirm = async () => {
    await addFDs(dependenciesSelector)
      .unwrap()
      .then(() => dispatch(clearFunctionalDependencies()))
      .catch((error) => console.log('Error sending FDs', error));
  };

  return (
    <>
      <ErrorNotification />
      <div className="p-5 max-w-3xl mx-auto border border-gray-200 rounded-lg bg-white shadow-sm">
        <h2>Функциональные зависимости</h2>
        <div className="flex flex-col gap-5 my-5 p-4 border border-gray-200 rounded bg-gray-50">
          <div className="flex flex-col gap-2">
            <label htmlFor="tableSelect">Отношение:</label>
            <select
              id="tableSelect"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded bg-white"
            >
              <option value="">---</option>
              {tables.map((table) => (
                <option key={table.name} value={table.name}>
                  {table.name}
                </option>
              ))}
            </select>
            {isLoading && <small>Загрузка...</small>}
          </div>
          {selectedTable && (
            <>
              <div className="flex items-center gap-2.5">
                <AttributesInFD
                  label="Детерминант:"
                  selectedTableAttributes={selectedTableAttributes}
                  selectedAttributes={selectedDeterminant}
                  onChangeHandler={setSelectedDeterminant}
                />
                <div className="text-2xl text-gray-600 text-center my-2.5">
                  →
                </div>
                <AttributesInFD
                  label="Зависимые атрибуты:"
                  selectedTableAttributes={selectedTableAttributes}
                  selectedAttributes={selectedDependent}
                  onChangeHandler={setSelectedDependent}
                />
              </div>
              <button
                className="btn-primary self-start"
                onClick={handleAddDependency}
                disabled={
                  !selectedDeterminant.length || !selectedDependent.length
                }
              >
                Добавить зависимость
              </button>
            </>
          )}
        </div>
        {dependenciesSelector.length !== 0 && <DependenciesList />}
        <span className="flex self-end gap-3">
          <button
            onClick={handleConfirm}
            disabled={dependenciesSelector.length === 0}
            className="btn-primary"
          >
            OK
          </button>
          <button onClick={onCancelClick} className="btn-secondary">
            Отмена
          </button>
        </span>
      </div>
    </>
  );
};
