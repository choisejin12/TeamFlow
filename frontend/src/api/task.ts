import axios from '../utils/axios';
import { Stats, Task } from '../types/task';

export const getStats = async (): Promise<Stats> => {
  const res = await axios.get('/tasks/stats');
  return res.data;
};

export const getMyTasks = async (): Promise<Task[]> => {
  const res = await axios.get('/tasks/mytasks');
  return res.data.tasks;
};

export const createTask = async (data: {
  teamId: string;
  title: string;
  status: string;
  dueDate: string;
  createdBy: string;
}) => {
  const res = await axios.post('/tasks', data);
  return res.data;
};

export const updateTask = async (taskId: string, data: {
  title: string;
  dueDate: string;
  status: string;
}) => {
  const res = await axios.patch(`/tasks/${taskId}`, data);
  return res.data;
};

export const deleteTask = async (taskId: string) => {
  const res = await axios.delete(`/tasks/${taskId}`);
  return res.data;
};