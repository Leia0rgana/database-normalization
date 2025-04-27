import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type FunctionalDependency = {
  id: string;
  determinant: string[];
  dependent: string[];
  tableName: string;
};

interface FunctionalDependenciesState {
  dependencies: FunctionalDependency[];
}

const initialState: FunctionalDependenciesState = {
  dependencies: [],
};

export const functionalDependenciesSlice = createSlice({
  name: 'functionalDependencies',
  initialState,
  reducers: {
    addFunctionalDependency: (
      state,
      action: PayloadAction<FunctionalDependency>
    ) => {
      state.dependencies.push(action.payload);
    },
    removeFunctionalDependency: (state, action: PayloadAction<string>) => {
      state.dependencies = state.dependencies.filter(
        (fd) => fd.id !== action.payload
      );
    },
    clearFunctionalDependencies: (state) => {
      state.dependencies = [];
    },
  },
});

export const {
  addFunctionalDependency,
  removeFunctionalDependency,
  clearFunctionalDependencies,
} = functionalDependenciesSlice.actions;

export const selectFunctionalDependencies = (state: RootState) =>
  state.functionalDependencies.dependencies;

export default functionalDependenciesSlice.reducer;
