import axios from '../utils/axios';
import { Task } from '../types/calendar';

export const fetchCalendarTasks = async (): Promise<Task[]> => {
  const res = await axios.get('/tasks/calendar');
  return res.data.tasks;
};