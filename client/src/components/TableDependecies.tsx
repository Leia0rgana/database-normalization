import React from 'react';
import { useGetFunctionalDependenciesQuery } from '../redux/api/functionalDependenciesApi';
import { FunctionalDependency, TableSchema } from '../utils/types';
import { ImSpinner2 } from 'react-icons/im';
import { useAppDispatch } from '../redux/hooks';
import { setError } from '../redux/slices/messageSlice';
import { Modal } from './UI/Modal';
import { FunctionalDependencies } from './FunctionalDependencies';
import { VscEdit } from 'react-icons/vsc';

type TableDependeciesProps = {
  tableInfo: TableSchema;
  onSetDependencies?: (data: FunctionalDependency[]) => void;
};

export const TableDependecies = (props: TableDependeciesProps) => {
  const { tableInfo, onSetDependencies } = props;
  const dispatch = useAppDispatch();

  const { data, isLoading, isFetching, isError } =
    useGetFunctionalDependenciesQuery(tableInfo.name);

  const [isEditModalOpen, setEditModalOpen] = React.useState(false);

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
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Функциональные зависимости</h3>
        <VscEdit
          className="text-xl cursor-pointer text-gray-500 hover:scale-120 transition-all ease-in-out duration-200"
          type="button"
          onClick={() => setEditModalOpen(true)}
        />
      </div>
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
      {isEditModalOpen && data && (
        <Modal label="Редактировать функциональные зависимости">
          <FunctionalDependencies
            editMode
            tableName={tableInfo.name}
            initialDependencies={data}
            onCancelClick={() => setEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};
