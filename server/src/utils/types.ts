export type Attribute = {
  name: string;
  isPrimaryKey: boolean;
  foreignKeyReference?: ForeignKeyReference;
};

export type ForeignKeyReference = {
  tableName: string;
  attributeName: string;
  relationshipType?: RelationshipType;
};

export type RelationshipType = '1-1' | '1-N' | 'N-M';

export type FunctionalDependency = {
  determinant: string[];
  dependent: string[];
};

export interface FunctionalDependencyState {
  tableName: string;
  determinant: string[];
  dependent: string[];
}

export type TableInfo = {
  _id?: string;
  user: string;
  name: string;
  attributeList: Attribute[];
  functionalDependencies: FunctionalDependency[];
  normalized?: boolean;
  originalTableName?: string;
};
