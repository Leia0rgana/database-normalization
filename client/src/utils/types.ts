export type Attribute = {
  name: string;
  isPrimaryKey?: boolean;
  foreignKeyReference?: ForeignKeyReference;
};

export type ForeignKeyReference = {
  tableName: string;
  attributeName: string;
  relationshipType?: RelationshipType;
};

export type RelationshipType = '1-1' | '1-N' | 'N-M';

export type FunctionalDependency = {
  id: string;
  determinant: string[];
  dependent: string[];
};

export type FunctionalDependencyState = FunctionalDependency & {
  tableName: string;
};

export type TableSchema = {
  _id?: string;
  name: string;
  attributeList: Array<Attribute>;
  normalized?: boolean;
};

export type User = {
  name?: string;
  email: string;
  password: string;
};

export type UserData = {
  name: string;
  role: 'user' | 'admin';
};

export type Response = {
  success: boolean;
};

export type TableInfo = {
  user: string;
  name: string;
  attributeList: Attribute[];
  functionalDependencies: FunctionalDependency[];
  normalized?: boolean;
};
