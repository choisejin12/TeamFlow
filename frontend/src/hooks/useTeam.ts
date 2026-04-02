import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeams, createTeam } from '../api/team';
import { CreateTeamInput, Team } from '../types/team';
import { UseMutationOptions } from '@tanstack/react-query';
import { deleteTeam } from '../api/team';

export const useTeams = () => {
  return useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: getTeams,
  });
};

export const useCreateTeam = (
  options?: UseMutationOptions<any, unknown, CreateTeamInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      options?.onSuccess?.(...args); 
    },
    onError: (...args) => {
      options?.onError?.(...args);
    }
  });
};



export const useDeleteTeam = () => {
  return useMutation({
    mutationFn: deleteTeam,
  });
};