import { useMutation } from '@tanstack/react-query';
import { createInviteCode } from '../api/join';

export const useInviteCode = () => {
  return useMutation({
    mutationFn: createInviteCode,
  });
};