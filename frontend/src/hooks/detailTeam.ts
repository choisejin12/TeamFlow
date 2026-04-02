import { useQuery } from '@tanstack/react-query';
import { getDetailTeam } from '../api/detailTeam';

export const useDetailTeam = (teamId: string) => {
  return useQuery({
    queryKey: ['teamDetail', teamId],
    queryFn: () => getDetailTeam(teamId),
    enabled: !!teamId,
  });
};