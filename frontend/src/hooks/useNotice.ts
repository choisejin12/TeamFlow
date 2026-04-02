import { useQuery } from '@tanstack/react-query';
import { getNotices } from '../api/notice';
import { Notice } from '../types/notice';

export const useNotice = () => {
  return useQuery<Notice[]>({
    queryKey: ['notices'],
    queryFn: getNotices,
  });
};