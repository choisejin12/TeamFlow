import axios from '../utils/axios';
import { AdminData } from '../types/admin';

export const fetchAdminAll = async (): Promise<AdminData> => {
  const [u, t, n] = await Promise.all([
    axios.get('/admin/users'),
    axios.get('/admin/teams'),
    axios.get('/admin/notices'),
  ]);

  return {
    users: u.data.users,
    teams: t.data.teams,
    notices: n.data.notices,
  };
};

export const searchAdmin = async (keyword: string): Promise<AdminData> => {
  const res = await axios.get(`/admin/search?q=${keyword}`);
  return res.data;
};

// 삭제
export const deleteUserApi = async (userId: string) => {
  const res = await axios.delete(`/admin/users/${userId}`);
  return res.data;
};

export const deleteTeamApi = async (teamId: string) => {
  const res = await axios.delete(`/admin/teams/${teamId}`);
  return res.data;
};

export const deleteNoticeApi = async (noticeId: string) => {
  const res = await axios.delete(`/admin/notices/${noticeId}`);
  return res.data;
};

export const createNoticeApi = async (title: string) => {
  const res = await axios.post('/admin/notices', { title });
  return res.data;
};