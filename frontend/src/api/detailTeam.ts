import axios from '../utils/axios';
import { DetailTeam } from '../types/detailTeam';

export const getDetailTeam = async (teamId: string): Promise<DetailTeam> => {
  const res = await axios.get(`/teams/${teamId}`);
  return res.data;
};