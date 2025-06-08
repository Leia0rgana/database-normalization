import tableInfo from '../models/tableInfo';
import { TableInfo } from '../utils/types';
import {
  deepCopyTable,
  dependencyExtraction,
  findPartialDependencies,
  findTransitiveDependencies,
} from '../utils/normalizationUtils';

export const normalizeTo3NF = async (
  originalTable: TableInfo
): Promise<TableInfo[]> => {
  const mainTable = deepCopyTable(originalTable, ' (норм)');
  const resultTables: TableInfo[] = [mainTable];

  const partialDeps = findPartialDependencies(mainTable);
  const transitiveDeps = findTransitiveDependencies(mainTable);
  const dependenciesToProcess = [...partialDeps, ...transitiveDeps];

  if (dependenciesToProcess.length === 0) {
    return [originalTable];
  }

  for (const dependency of dependenciesToProcess) {
    await dependencyExtraction(mainTable, dependency, resultTables);
  }

  if (originalTable._id) {
    await tableInfo.updateOne(
      { _id: originalTable._id },
      { $set: { normalized: true } }
    );
  }

  return resultTables;
};
