import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../utils/types';
import { RootState } from '../store';

interface UserState {
  userData: UserData;
}

const initialState: UserState = {
  userData: {
    isAccountVerified: false,
    name: '',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const selectUser = (state: RootState) => state.user.userData;
export const { setUserData, clearUser } = userSlice.actions;
export default userSlice.reducer;
