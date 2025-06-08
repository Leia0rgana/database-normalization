import tableInfo from '../models/tableInfo';
import { TableInfo } from '../utils/types';
import {
  deepCopyTable,
  createTableFromDependency,
  removeAttributesFromTable,
  addForeignKeyReference,
  removeFunctionalDependency,
  findTransitiveDependencies,
} from '../utils/normalizationUtils';

export const normalizeTo3NF = async (
  originalTable: TableInfo
): Promise<TableInfo[] | null> => {
  const originalTableCopy = deepCopyTable(originalTable, ' (3НФ)');
  const resultTables: TableInfo[] = [originalTableCopy];

  const transitiveDependencies = findTransitiveDependencies(originalTableCopy);

  if (transitiveDependencies.length === 0) {
    return null;
  }

  for (const td of transitiveDependencies) {
    const andConditions = td.determinant.map((d) => ({
      attributeList: { $elemMatch: { name: d, isPrimaryKey: true } },
    }));

    const query = {
      $and: [
        ...andConditions,
        { attributeList: { $size: td.determinant.length } },
        { user: originalTable.user },
      ],
    };

    const existingTable = await tableInfo.findOne(query);

    if (existingTable) {
      addForeignKeyReference(
        originalTableCopy,
        td.determinant,
        existingTable.name
      );
      removeAttributesFromTable(originalTableCopy, td.dependent);
      removeFunctionalDependency(originalTableCopy, td);

      const tableAlreadyInResults = resultTables.find(
        (t) => t.name === existingTable.name
      );
      if (!tableAlreadyInResults) {
        resultTables.push(existingTable as unknown as TableInfo);
      }
    } else {
      const newTable = createTableFromDependency(originalTableCopy, td);
      addForeignKeyReference(originalTableCopy, td.determinant, newTable.name);
      removeAttributesFromTable(originalTableCopy, td.dependent);
      removeFunctionalDependency(originalTableCopy, td);
      resultTables.push(newTable);
    }
  }

  if (resultTables.length > 1 && originalTable._id) {
    await tableInfo.updateOne(
      { _id: originalTable._id },
      { $set: { normalized: true } }
    );
  }

  return resultTables;
};
