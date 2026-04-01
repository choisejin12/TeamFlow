import axios from '../../utils/axios';

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type RegisterResponse = {
  message?: string;
};

export const registerAPI = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const res = await axios.post('/users/register', data);
  return res.data;
};