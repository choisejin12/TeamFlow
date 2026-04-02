import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminAll,
  searchAdmin,
  deleteUserApi,
  deleteTeamApi,
  deleteNoticeApi,
  createNoticeApi,
} from '../api/admin';
import { AdminData } from '../types/admin';


export const useAdminData = (keyword: string) => {
  return useQuery<AdminData>({
    queryKey: ['admin', keyword],
    queryFn: () =>
      keyword.trim() ? searchAdmin(keyword) : fetchAdminAll(),
  });
};

// 삭제들
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeamApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNoticeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNoticeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};