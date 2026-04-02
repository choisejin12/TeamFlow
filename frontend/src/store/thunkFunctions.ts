import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

type User = {
  id: string;
  email: string;
  name: string;
  platformRole: 'ADMIN' | 'USER';
};

type AuthResponse = User;

type ErrorResponse = {
  message: string;
};

// 🔥 로그인 유지 (auth API)
export const authUser = createAsyncThunk<
  AuthResponse,         // return 타입
  void,                 // 파라미터 없음
  { rejectValue: ErrorResponse }
>(
  'user/authUser',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/users/auth');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);