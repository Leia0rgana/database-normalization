import tableInfo from '../models/tableInfo';
import { TableInfo, FunctionalDependency } from '../utils/types';

export const normalizeTo2NF = async (
  originalTable: TableInfo
): Promise<TableInfo[]> => {
  const resultTables: TableInfo[] = [originalTable];

  // 1. Выделяем составной первичный ключ
  const primaryKey = originalTable.attributeList
    .filter((attr) => attr.isPrimaryKey)
    .map((attr) => attr.name);

  // 2. Если первичный ключ простой, таблица уже во 2НФ
  if (primaryKey.length <= 1) return resultTables;

  // 3. Анализ функциональных зависимостей
  const partialDependencies: FunctionalDependency[] = [];

  for (const fd of originalTable.functionalDependencies) {
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
      // Обновляем исходную таблицу
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

      // Удаляем зависимые атрибуты
      originalTableRef.attributeList = originalTableRef.attributeList.filter(
        (attr) => !pd.dependent.includes(attr.name)
      );

      resultTables.push(existingTable as unknown as TableInfo); // TODO fix
    } else {
      const newTable: TableInfo = {
        name: `${originalTable.name}_${pd.determinant.join('_')}`,
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
          ...originalTable.attributeList.find((a) => a.name === name)!,
          isPrimaryKey: false,
        }))
      );

      // Добавляем внешние ключи к существующим атрибутам
      pd.determinant.forEach((determinantAttrName) => {
        const attr = originalTable.attributeList.find(
          (a) => a.name === determinantAttrName
        );
        if (attr) {
          attr.foreignKeyReference = {
            tableName: newTable.name,
            attributeName: determinantAttrName,
          };
        }
      });

      // Удаляем зависимые атрибуты из исходной таблицы
      originalTable.attributeList = originalTable.attributeList.filter(
        (attr) => !pd.dependent.includes(attr.name)
      );

      resultTables.push(newTable);
    }
  }

  return resultTables;
};
