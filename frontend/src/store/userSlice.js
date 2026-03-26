import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, authUser } from './thunkFunctions';

const initialState = {
    userData : {
        id: '',
        email: '',
        name: '',
        platformRole : 'ADMIN',
    },
    isAuth: false, // isAuth 👉 로그인 상태 여부
    isLoading: false, // isAuth 👉 로딩 상태 여부
    error : ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {logout: (state) => {
  localStorage.removeItem('accessToken');
  state.userData = initialState.userData; // User 정보를 초기화
  state.isLoading = false;
  state.isAuth = false;
  state.error = null;
}},
  extraReducers: (builder) => {
    builder

      // 로그인
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })


      // 회원가입
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // 로그인 유지
      .addCase(authUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.isAuth = true;
      })
      .addCase(authUser.rejected, (state) => {
        state.isLoading = false;
        state.error = action.payload; 
        state.userData = null;
        state.isAuth = false;
        localStorage.removeItem('accessToken'); // localStorage에서 토큰값 삭제
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;