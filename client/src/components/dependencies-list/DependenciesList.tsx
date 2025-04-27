import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import style from './DependenciesList.module.css';
import {
  removeFunctionalDependency,
  selectFunctionalDependencies,
} from '../../redux/slices/functionalDependenciesSlice';

export const DependenciesList = () => {
  const dependenciesSelector = useAppSelector(selectFunctionalDependencies);
  const dispatch = useAppDispatch();

  return (
    <ul className={style.dependenciesList}>
      {dependenciesSelector?.map((fd) => (
        <li key={fd.id} className={style.dependencyItem}>
          <span className={style.tableName}>{fd.tableName}: </span>
          <span className={style.determinant}>
            {fd.determinant.map((attribute) => attribute).join(', ')}
          </span>
          <span className={style.arrow}> → </span>
          <span className={style.dependent}>
            {fd.dependent.map((attribute) => attribute).join(', ')}
          </span>
          <button
            className={style.deleteButton}
            onClick={() => dispatch(removeFunctionalDependency(fd.id))}
          >
            Удалить
          </button>
        </li>
      ))}
    </ul>
  );
};
