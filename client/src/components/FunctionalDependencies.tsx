import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  addFunctionalDependency,
  clearFunctionalDependencies,
  selectFunctionalDependencies,
  setFunctionalDependencies,
} from '../redux/slices/functionalDependenciesSlice';
import { useGetTableInfosQuery } from '../redux/api/tableSchemaApi';
import {
  useAddFunctionalDependenciesMutation,
  useUpdateFunctionalDependenciesMutation,
} from '../redux/api/functionalDependenciesApi';
import { AttributesInFD } from './AttributesInFD';
import {
  Attribute,
  FunctionalDependency,
  FunctionalDependencyState,
} from '../utils/types';
import { DependenciesList } from './DependenciesList';
import { setError } from '../redux/slices/messageSlice';
import { ImSpinner2 } from 'react-icons/im';

type Props = {
  onCancelClick: () => void;
  editMode?: boolean;
  tableName?: string;
  initialDependencies?: FunctionalDependency[];
};

export const FunctionalDependencies = (props: Props) => {
  const { onCancelClick, editMode, tableName, initialDependencies } = props;

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
  const [updateFDs] = useUpdateFunctionalDependenciesMutation();

  React.useEffect(() => {
    if (isError) {
      dispatch(setError('Не удалось получить данные об отношениях'));
    }
  }, [dispatch, isError]);

  React.useEffect(() => {
    dispatch(clearFunctionalDependencies());
    if (editMode && initialDependencies) {
      if (tableName) {
        const dependencies = initialDependencies.map((dep) => {
          return {
            id: String(1234 + Math.random() * 99999),
            determinant: dep.determinant,
            dependent: dep.dependent,
            tableName: tableName,
          };
        });

        dispatch(setFunctionalDependencies(dependencies));
        setSelectedTable(tableName || '');
      }
    }
  }, [editMode, initialDependencies, tableName, dispatch]);

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

      const newFD: FunctionalDependencyState = {
        id: String(1234 + Math.random() * 99999),
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
    if (editMode && tableName) {
      await updateFDs({
        tableName,
        functionalDependencies: dependenciesSelector,
      })
        .unwrap()
        .catch(() => {
          dispatch(setError('Не удалось обновить функциональные зависимости'));
        });
    } else {
      await addFDs(dependenciesSelector)
        .unwrap()
        .catch(() => {
          dispatch(setError('Не удалось сохранить функциональные зависимости'));
        });
    }
    dispatch(clearFunctionalDependencies());
    if (onCancelClick) onCancelClick();
  };

  return (
    <>
      <div className="flex flex-col gap-5 my-5 p-4 border border-gray-200 rounded bg-gray-50">
        <div className="flex flex-col gap-2">
          <label htmlFor="tableSelect">Отношение:</label>
          {isLoading ? (
            <ImSpinner2 className="spinner my-1 mx-auto" />
          ) : (
            <select
              id="tableSelect"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              disabled={isLoading || editMode}
              className="px-3 py-2 border border-gray-300 rounded bg-white"
            >
              <>
                <option value="">---</option>
                {tables.map((table) => (
                  <option key={table.name} value={table.name}>
                    {table.name}
                  </option>
                ))}
              </>
            </select>
          )}
        </div>
        {selectedTable && (
          <>
            <div className="flex flex-col sm:flex-row items-center sm:gap-2.5">
              <AttributesInFD
                label="Детерминант:"
                selectedTableAttributes={selectedTableAttributes}
                selectedAttributes={selectedDeterminant}
                onChangeHandler={setSelectedDeterminant}
              />
              <div className="text-2xl text-gray-600 text-center">→</div>
              <AttributesInFD
                label="Зависимые атрибуты:"
                selectedTableAttributes={selectedTableAttributes}
                selectedAttributes={selectedDependent}
                onChangeHandler={setSelectedDependent}
              />
            </div>
            <button
              className="btn-primary m-auto"
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
      <span className="flex justify-center sm:justify-start gap-3 mt-5">
        <button
          onClick={handleConfirm}
          disabled={!editMode && dependenciesSelector.length === 0}
          className="btn-primary"
        >
          OK
        </button>
        <button onClick={onCancelClick} className="btn-secondary">
          Отмена
        </button>
      </span>
    </>
  );
};
