import React from 'react';
import { useGetFunctionalDependenciesQuery } from '../redux/api/functionalDependenciesApi';
import { FunctionalDependency, TableSchema } from '../utils/types';
import { ImSpinner2 } from 'react-icons/im';
import { useAppDispatch } from '../redux/hooks';
import { setError } from '../redux/slices/errorSlice';

type TableDependeciesProps = {
  tableInfo: TableSchema;
  onSetDependencies?: (data: FunctionalDependency[]) => void;
};

export const TableDependecies = (props: TableDependeciesProps) => {
  const { tableInfo, onSetDependencies } = props;
  const dispatch = useAppDispatch();

  const { data, isLoading, isFetching, isError } =
    useGetFunctionalDependenciesQuery(tableInfo.name);

  React.useEffect(() => {
    if (data) {
      if (onSetDependencies) onSetDependencies(data);
    }
  }, [data, onSetDependencies]);

  if (isError) dispatch(setError('Ошибка при загрузке зависимостей'));

  if ((!isLoading || !isFetching) && (!data || data.length === 0))
    return <div className="text-gray-500">Нет функциональных зависимостей</div>;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Функциональные зависимости:</h3>
      {(isLoading || isFetching) && (
        <ImSpinner2 className="spinner self-center p-2 m-2" />
      )}
      {data?.map((dependency, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="font-medium">
            {dependency.determinant.join(', ')}
          </span>
          <span>→</span>
          <span>{dependency.dependent.join(', ')}</span>
        </div>
      ))}
    </div>
  );
};
