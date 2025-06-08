import tableInfo from '../models/tableInfo';
import { TableInfo, FunctionalDependency } from './types';

export const deepCopyTable = (table: TableInfo, suffix: string): TableInfo => {
  return {
    name: table.name + suffix,
    user: table.user,
    attributeList: JSON.parse(JSON.stringify(table.attributeList)),
    functionalDependencies: JSON.parse(
      JSON.stringify(table.functionalDependencies || [])
    ),
  };
};

export const getPrimaryKey = (table: TableInfo): string[] =>
  table.attributeList
    .filter((attr) => attr.isPrimaryKey)
    .map((attr) => attr.name);

export const isKey = (attributes: string[], primaryKey: string[]) =>
  attributes.length === primaryKey.length &&
  attributes.every((d) => primaryKey.includes(d));

export const isStrictSubset = (
  subset: string[],
  superset: string[]
): boolean => {
  const isSubset = subset.every((item) => superset.includes(item));
  return subset.length < superset.length && isSubset;
};

export const findPartialDependencies = (
  table: TableInfo
): FunctionalDependency[] => {
  const primaryKey = getPrimaryKey(table);

  if (primaryKey.length <= 1) {
    return [];
  }

  const partialDependencies: FunctionalDependency[] = [];
  const functionalDependencies = table.functionalDependencies || [];

  for (const fd of functionalDependencies) {
    const determinantIsStrictSubsetOfPK = isStrictSubset(
      fd.determinant,
      primaryKey
    );
    const dependentIsNonKey = fd.dependent.every(
      (d) => !primaryKey.includes(d)
    );

    if (determinantIsStrictSubsetOfPK && dependentIsNonKey) {
      partialDependencies.push(fd);
    }
  }
  return partialDependencies;
};

export const createTableFromDependency = (
  originalTable: TableInfo,
  fd: FunctionalDependency,
  newTableName?: string
): TableInfo => {
  const newTable: TableInfo = {
    user: originalTable.user,
    name: newTableName || `${originalTable.name}_${fd.determinant.join('_')}`,
    attributeList: [],
    functionalDependencies: [],
  };

  newTable.attributeList = fd.determinant.map((name) => ({
    name,
    isPrimaryKey: true,
  }));

  const dependentAttributes = fd.dependent.map((name) => {
    const originalAttr = originalTable.attributeList.find(
      (a) => a.name === name
    )!;
    return {
      ...originalAttr,
      isPrimaryKey: false,
    };
  });

  newTable.attributeList.push(...dependentAttributes);
  return newTable;
};

export const removeAttributesFromTable = (
  table: TableInfo,
  attributes: string[]
) => {
  table.attributeList = table.attributeList.filter(
    (attr) => !attributes.includes(attr.name)
  );
};

export const addForeignKeyReference = (
  table: TableInfo,
  аttributesToBeFK: string[],
  referencedTableName: string
) => {
  аttributesToBeFK.forEach((attrName) => {
    const attr = table.attributeList.find((a) => a.name === attrName);
    if (attr) {
      attr.foreignKeyReference = {
        tableName: referencedTableName,
        attributeName: attrName,
      };
    }
  });
};

export const removeFunctionalDependency = (
  table: TableInfo,
  fdToRemove: FunctionalDependency
) => {
  if (!table.functionalDependencies) return;

  table.functionalDependencies = table.functionalDependencies.filter(
    (fd) =>
      !(
        JSON.stringify(fd.determinant.sort()) ===
          JSON.stringify(fdToRemove.determinant.sort()) &&
        JSON.stringify(fd.dependent.sort()) ===
          JSON.stringify(fdToRemove.dependent.sort())
      )
  );
};

export const findTransitiveDependencies = (table: TableInfo) => {
  const primaryKey = getPrimaryKey(table);
  const fds = table.functionalDependencies || [];

  return fds.filter((fd) => {
    const determinantIsKey = isKey(fd.determinant, primaryKey);
    const determinantIsStrictSubset = isStrictSubset(
      fd.determinant,
      primaryKey
    );
    const dependentIsNonKey = fd.dependent.every(
      (d) => !primaryKey.includes(d)
    );
    return !determinantIsKey && !determinantIsStrictSubset && dependentIsNonKey;
  });
};

export const dependencyExtraction = async (
  originalTable: TableInfo,
  dependencyToExtract: FunctionalDependency,
  resultTables: TableInfo[]
): Promise<void> => {
  const query = {
    'attributeList.name': { $all: dependencyToExtract.determinant },
    'attributeList.isPrimaryKey': true,
    attributeList: { $size: dependencyToExtract.determinant.length },
    user: originalTable.user,
  };

  const existingTable = await tableInfo.findOne(query);
  let newOrExistingTable: TableInfo;

  if (existingTable) {
    newOrExistingTable = existingTable as unknown as TableInfo;

    if (!resultTables.some((t) => t.name === newOrExistingTable.name)) {
      resultTables.push(newOrExistingTable);
    }
  } else {
    newOrExistingTable = createTableFromDependency(
      originalTable,
      dependencyToExtract
    );
    resultTables.push(newOrExistingTable);
  }

  addForeignKeyReference(
    originalTable,
    dependencyToExtract.determinant,
    newOrExistingTable.name
  );
  removeAttributesFromTable(originalTable, dependencyToExtract.dependent);
  removeFunctionalDependency(originalTable, dependencyToExtract);
};
