import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  email: string;
  name: string;
  platformRole: string;
};

type UserState = {
  userData: User | null;
  isAuth: boolean;
};

const initialState: UserState = {
  userData: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    // ✅ 로그인 성공 시
    setUser: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
      state.isAuth = true;
    },

    // ✅ 로그아웃
    logout: (state) => {
      localStorage.removeItem('accessToken');
      state.userData = null;
      state.isAuth = false;
    },

  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;