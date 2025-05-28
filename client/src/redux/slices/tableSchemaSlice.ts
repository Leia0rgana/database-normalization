import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Attribute, TableSchema } from '../../utils/types';

const initialState: TableSchema = {
  name: '',
  attributeList: [],
};

export const tableSchemaSlice = createSlice({
  name: 'tableSchema',
  initialState,
  reducers: {
    setTableName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    addAttributeToTable: (state, action: PayloadAction<Attribute>) => {
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

export const selectTableName = (state: RootState) => state.tableSchema.name;
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
