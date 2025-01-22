import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AttributeState {
  name: string;
  isPrimaryKey: boolean;
  isForeignKey?: boolean;
}

export interface TableSchemaState {
  tableName: string;
  attributeList: AttributeState[];
}

const initialState: TableSchemaState = {
  tableName: '',
  attributeList: [],
};

export const tableSchemaSlice = createSlice({
  name: 'tableSchema',
  initialState,
  reducers: {
    setTableName: (state, action: PayloadAction<string>) => {
      state.tableName = action.payload;
    },
    setAttributeList: (state, action: PayloadAction<AttributeState>) => {
      state.attributeList.push(action.payload);
    },
    removeAttributeFromList: (state, action: PayloadAction<string>) => {
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
  setAttributeList,
  removeAttributeFromList,
  clearList,
  setTableName,
  clearSchema,
} = tableSchemaSlice.actions;

export default tableSchemaSlice.reducer;
