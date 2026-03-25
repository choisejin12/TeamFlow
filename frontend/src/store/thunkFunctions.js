import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

// 🔥 로그인
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post('/users/login', data);

      // 토큰 저장
      localStorage.setItem('accessToken', res.data.accessToken);

      return res.data.user;

    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// 🔥 회원가입
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post('/users/register', data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// 🔥 로그인 유지 (auth API)
export const authUser = createAsyncThunk(
  'user/authUser',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/users/auth');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);