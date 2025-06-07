import tableInfo from '../models/tableInfo';
import { TableInfo } from '../utils/types';
import {
  deepCopyTable,
  findPartialDependencies,
  createTableFromDependency,
  removeAttributesFromTable,
  addForeignKeyReference,
  removeFunctionalDependency,
} from '../utils/normalizationUtils';

export const normalizeTo2NF = async (
  originalTable: TableInfo
): Promise<TableInfo[]> => {
  const originalTableCopy = deepCopyTable(originalTable, ' (2НФ)');
  const resultTables: TableInfo[] = [originalTableCopy];

  const partialDependencies = findPartialDependencies(originalTableCopy);

  if (partialDependencies.length === 0) {
    return resultTables;
  }

  for (const pd of partialDependencies) {
    const andConditions = pd.determinant.map((d) => ({
      attributeList: { $elemMatch: { name: d, isPrimaryKey: true } },
    }));

    const query = {
      $and: [
        ...andConditions,
        { attributeList: { $size: pd.determinant.length } },
        { user: originalTable.user },
      ],
    };

    const existingTable = await tableInfo.findOne(query);

    if (existingTable) {
      addForeignKeyReference(
        originalTableCopy,
        pd.determinant,
        existingTable.name!
      );
      removeAttributesFromTable(originalTableCopy, pd.dependent);
      removeFunctionalDependency(originalTableCopy, pd);

      const tableAlreadyInResults = resultTables.find(
        (t) => t.name === existingTable.name
      );
      if (!tableAlreadyInResults) {
        resultTables.push(existingTable as unknown as TableInfo);
      }
    } else {
      const newTable = createTableFromDependency(originalTableCopy, pd);

      addForeignKeyReference(originalTableCopy, pd.determinant, newTable.name);
      removeAttributesFromTable(originalTableCopy, pd.dependent);
      removeFunctionalDependency(originalTableCopy, pd);
      resultTables.push(newTable);
    }
  }

  return resultTables;
};
