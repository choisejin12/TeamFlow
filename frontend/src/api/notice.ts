import axios from '../utils/axios';
import { Notice } from '../types/notice';

export const getNotices = async (): Promise<Notice[]> => {
  const res = await axios.get('/admin/notices');
  return res.data.notices;
};