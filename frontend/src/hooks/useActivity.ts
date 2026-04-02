import { useQuery } from '@tanstack/react-query';
import { getActivities } from '../api/activity';
import { Activity } from '../types/activity';

export const useActivities = () => {
  return useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: getActivities,
  });
};