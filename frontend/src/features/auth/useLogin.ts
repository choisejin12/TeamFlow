import { useMutation } from '@tanstack/react-query';
import { loginAPI, LoginRequest } from './authAPI';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => loginAPI(data),
  });
};