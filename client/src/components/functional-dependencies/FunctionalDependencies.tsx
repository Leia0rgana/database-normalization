import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import style from './FunctionalDependencies.module.css';
import {
  addFunctionalDependency,
  clearFunctionalDependencies,
  selectFunctionalDependencies,
  type FunctionalDependency,
} from '../../redux/slices/functionalDependenciesSlice';
import { useGetTableInfosQuery } from '../../redux/api/tableSchemaEndpoints';
import { useAddFunctionalDependenciesMutation } from '../../redux/api/functionalDependenciesEndpoints';
import { AttributesInFD } from '../attributes-in-fd';
import { Attribute } from '../../utils/types';
import { DependenciesList } from '../dependencies-list';

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

  const { data: tables = [], isLoading } = useGetTableInfosQuery(); //TODO lazy
  const [addFDs] = useAddFunctionalDependenciesMutation();

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
    <div className={style.functionalDependenciesContainer}>
      <h2>Функциональные зависимости</h2>
      <div className={style.dependencyForm}>
        <div className={style.tableSelector}>
          <label htmlFor="tableSelect">Отношение:</label>
          <select
            id="tableSelect"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            disabled={isLoading}
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
              <div className={style.dependencyArrow}>→</div>
              <AttributesInFD
                label="Зависимые атрибуты:"
                selectedTableAttributes={selectedTableAttributes}
                selectedAttributes={selectedDependent}
                onChangeHandler={setSelectedDependent}
              />
            </div>
            <button
              className={style.addButton}
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
      <span className={style.buttonGroup}>
        <button
          onClick={handleConfirm}
          disabled={dependenciesSelector.length === 0}
        >
          OK
        </button>
        <button onClick={onCancelClick}>Отмена</button>
      </span>
    </div>
  );
};
