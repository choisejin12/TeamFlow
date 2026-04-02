import axios from '../utils/axios';
import { Team, CreateTeamInput } from '../types/team';

export const getTeams = async (): Promise<Team[]> => {
  const res = await axios.get('/teams');
  return res.data.teams;
};

export const createTeam = async (data: CreateTeamInput) => {
  const res = await axios.post('/teams', data);
  return res.data;
};

export const deleteTeam = async (teamId: string) => {
  const res = await axios.delete(`/teams/${teamId}`);
  return res.data;
};