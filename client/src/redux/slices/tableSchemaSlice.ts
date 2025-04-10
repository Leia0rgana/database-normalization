import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ForeignKeyReference, FunctionalDependency } from '../../utils/types';
export interface AttributeState {
  name: string;
  isPrimaryKey: boolean;
  foreignKeyReference?: ForeignKeyReference;
}

export interface TableSchemaState {
  tableName: string;
  attributeList: AttributeState[];
  functionalDependencies?: FunctionalDependency[];
}

const initialState: TableSchemaState = {
  tableName: '',
  attributeList: [],
  functionalDependencies: [],
};

export const tableSchemaSlice = createSlice({
  name: 'tableSchema',
  initialState,
  reducers: {
    setTableName: (state, action: PayloadAction<string>) => {
      state.tableName = action.payload;
    },
    addAttributeToTable: (state, action: PayloadAction<AttributeState>) => {
      state.attributeList.push(action.payload);
    },
    removeAttributeFromTable: (state, action: PayloadAction<string>) => {
      state.attributeList = state.attributeList.filter(
        (attribute) => attribute.name !== action.payload
      );
    },
    clearList: (state) => {
      state.attributeList = [];
    },
    clearSchema: () => {
      return initialState;
    },
  },
});

export const selectTableName = (state: RootState) =>
  state.tableSchema.tableName;
export const selectAttributeList = (state: RootState) =>
  state.tableSchema.attributeList;

export const {
  addAttributeToTable,
  removeAttributeFromTable,
  clearList,
  setTableName,
  clearSchema,
} = tableSchemaSlice.actions;

export default tableSchemaSlice.reducer;
