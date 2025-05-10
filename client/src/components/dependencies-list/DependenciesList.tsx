import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  removeFunctionalDependency,
  selectFunctionalDependencies,
} from '../../redux/slices/functionalDependenciesSlice';

export const DependenciesList = () => {
  const dependenciesSelector = useAppSelector(selectFunctionalDependencies);
  const dispatch = useAppDispatch();

  return (
    <ul className="mt-8">
      {dependenciesSelector?.map((fd) => (
        <li
          key={fd.id}
          className="flex items-center gap-2.5 p-3 border-b border-gray-200 bg-gray-50 rounded mb-2"
        >
          <span className="font-semibold text-gray-600">{fd.tableName}: </span>
          <span className="bg-gray-100 px-2 py-1 rounded font-mono">
            {fd.determinant.map((attribute) => attribute).join(', ')}
          </span>
          <span className="text-gray-600 font-bold"> → </span>
          <span className="bg-gray-100 px-2 py-1 rounded font-mono">
            {fd.dependent.map((attribute) => attribute).join(', ')}
          </span>
          <button
            className="ml-auto px-3 py-1.5 bg-red-400 text-white rounded text-sm transition-all duration-200 hover:bg-red-500"
            onClick={() => dispatch(removeFunctionalDependency(fd.id))}
          >
            Удалить
          </button>
        </li>
      ))}
    </ul>
  );
};
