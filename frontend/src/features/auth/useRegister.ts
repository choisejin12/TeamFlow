import { useMutation } from '@tanstack/react-query';
import { registerAPI, RegisterRequest } from './authAPI';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => registerAPI(data),
  });
};