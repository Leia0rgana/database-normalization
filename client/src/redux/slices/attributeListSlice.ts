import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AttributeState {
  name: string;
  type: string;
  isPrimaryKey: boolean;
}

export interface AttributeStateList {
  attributeList: AttributeState[];
}

const initialState: AttributeStateList = {
  attributeList: [],
};

export const attributeListSlice = createSlice({
  name: 'attributeList',
  initialState,
  reducers: {
    setAttributeList: (state, action: PayloadAction<AttributeState>) => {
      state.attributeList.push(action.payload);
    },
    removeAttributeFromList: (state, action: PayloadAction<string>) => {
      state.attributeList.filter(
        (attribute) => attribute.name !== action.payload
      );
    },
    clearList: () => {
      return initialState;
    },
  },
});

export const selectAttributeList = (state: RootState) =>
  state.attributeList.attributeList;

export const { setAttributeList, removeAttributeFromList, clearList } =
  attributeListSlice.actions;

export default attributeListSlice.reducer;
