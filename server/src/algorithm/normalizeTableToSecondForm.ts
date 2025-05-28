import tableInfo from '../models/tableInfo';
import { TableInfo, FunctionalDependency } from '../utils/types';

export const normalizeTo2NF = async (
  originalTable: TableInfo
): Promise<TableInfo[]> => {
  // Создаем глубокую копию исходной таблицы
  const originalTableCopy: TableInfo = {
    name: originalTable.name + ' (2НФ)',
    user: originalTable.user,
    attributeList: JSON.parse(JSON.stringify(originalTable.attributeList)),
    functionalDependencies: JSON.parse(
      JSON.stringify(originalTable.functionalDependencies)
    ),
  };
  // const originalTableCopy: TableInfo = JSON.parse(
  //   JSON.stringify(originalTable)
  // );

  console.log(originalTableCopy);
  const resultTables: TableInfo[] = [originalTableCopy];

  // 1. Выделяем составной первичный ключ
  const primaryKey = originalTableCopy.attributeList
    .filter((attr) => attr.isPrimaryKey)
    .map((attr) => attr.name);

  // 2. Если первичный ключ простой, таблица уже во 2НФ
  if (primaryKey.length <= 1) return resultTables;

  // 3. Анализ функциональных зависимостей
  const partialDependencies: FunctionalDependency[] = [];

  for (const fd of originalTableCopy.functionalDependencies) {
    // 4. Проверяем частичную зависимость
    const determinantIsSubset = fd.determinant.every((d) =>
      primaryKey.includes(d)
    );

    const determinantIsStrictSubset =
      determinantIsSubset && fd.determinant.length < primaryKey.length;

    const dependentIsNonKey = !fd.dependent.some((d) => primaryKey.includes(d));

    if (determinantIsStrictSubset && dependentIsNonKey) {
      partialDependencies.push(fd);
    }
  }

  // 5. Создаем новые таблицы для частичных зависимостей
  for (const pd of partialDependencies) {
    const existingTable = await tableInfo.findOne({
      attributeList: {
        $all: pd.determinant.map((d) => ({
          $elemMatch: {
            name: d,
            isPrimaryKey: true,
          },
        })),
        $size: pd.determinant.length,
      },
    });

    if (existingTable) {
      // Обновляем копию исходной таблицы
      const originalTableRef = resultTables[0];

      // Добавляем ссылки на существующую таблицу
      pd.determinant.forEach((attrName) => {
        const attr = originalTableRef.attributeList.find(
          (a) => a.name === attrName
        );
        if (attr) {
          attr.foreignKeyReference = {
            tableName: existingTable.name!,
            attributeName: attrName,
          };
        }
      });

      // Удаляем зависимые атрибуты из копии
      originalTableRef.attributeList = originalTableRef.attributeList.filter(
        (attr) => !pd.dependent.includes(attr.name)
      );

      // Удаляем функциональную зависимость, от которой избавились
      originalTableRef.functionalDependencies =
        originalTableRef.functionalDependencies.filter(
          (fd) =>
            !(
              fd.determinant.join(',') === pd.determinant.join(',') &&
              fd.dependent.join(',') === pd.dependent.join(',')
            )
        );

      resultTables.push(existingTable as unknown as TableInfo);
    } else {
      const newTable: TableInfo = {
        user: originalTableCopy.user,
        name: `${originalTableCopy.name}_${pd.determinant.join('_')}`,
        attributeList: [],
        functionalDependencies: [],
      };

      // Добавляем атрибуты детерминанта
      newTable.attributeList = pd.determinant.map((name) => ({
        name,
        isPrimaryKey: true,
      }));

      // Добавляем зависимые атрибуты
      newTable.attributeList.push(
        ...pd.dependent.map((name) => ({
          ...originalTableCopy.attributeList.find((a) => a.name === name)!,
          isPrimaryKey: false,
        }))
      );

      // Добавляем внешние ключи к существующим атрибутам в копии
      pd.determinant.forEach((determinantAttrName) => {
        const attr = originalTableCopy.attributeList.find(
          (a) => a.name === determinantAttrName
        );
        if (attr) {
          attr.foreignKeyReference = {
            tableName: newTable.name,
            attributeName: determinantAttrName,
          };
        }
      });

      // Удаляем зависимые атрибуты из копии
      originalTableCopy.attributeList = originalTableCopy.attributeList.filter(
        (attr) => !pd.dependent.includes(attr.name)
      );

      // Удаляем функциональную зависимость, от которой избавились
      originalTableCopy.functionalDependencies =
        originalTableCopy.functionalDependencies.filter(
          (fd) =>
            !(
              fd.determinant.join(',') === pd.determinant.join(',') &&
              fd.dependent.join(',') === pd.dependent.join(',')
            )
        );

      resultTables.push(newTable);
    }
  }

  return resultTables;
};
