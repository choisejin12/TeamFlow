import axios from '../utils/axios';
import { JoinResponse } from '../types/join';


export const joinTeam = async (code: string): Promise<JoinResponse> => {
  const res = await axios.post('/invite/join', { code });
  return res.data;
};

export const createInviteCode = async (teamId: string) => {
  const res = await axios.post(`/invite/${teamId}`);
  return res.data;
};