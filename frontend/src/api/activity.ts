import axios from '../utils/axios';
import { Activity } from '../types/activity';

export const getActivities = async (): Promise<Activity[]> => {
  const res = await axios.get('/admin/activities');
  return res.data.activities;
};