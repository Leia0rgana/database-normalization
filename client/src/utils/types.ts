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
  name: string;
  attributeList: Array<Attribute>;
};

export type User = {
  name?: string;
  email: string;
  password: string;
};

export type UserData = {
  name: string;
  isAccountVerified?: boolean;
};

export type Response = {
  success: boolean;
};
