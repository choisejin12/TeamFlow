import axios from '../../utils/axios';

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};


//회원가입
export type RegisterResponse = {
  message?: string;
};

export const registerAPI = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const res = await axios.post('/users/register', data);
  return res.data;
};


//로그인
export type LoginRequest = {
  email: string;
  password: string;
};

export const loginAPI = async (data: LoginRequest) => {
  const res = await axios.post('/users/login', data);

  localStorage.setItem('accessToken', res.data.accessToken);

  return res.data.user;
};