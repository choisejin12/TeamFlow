import { useQuery } from '@tanstack/react-query';
import { getStats, getMyTasks } from '../api/task';
import { Stats, Task } from '../types/task';
import { createTask, updateTask, deleteTask } from '../api/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// ✅ 통계
export const useStats = () => {
  return useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: getStats,
  });
};

// ✅ 내 할일
export const useMyTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['myTasks'],
    queryFn: getMyTasks,
  });
};


export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['teamDetail', variables.teamId],
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: any) => updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamDetail'] });
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamDetail'] });
    }
  });
};