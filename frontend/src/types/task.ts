export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Stats = {
  total: number;
  done: number;
  progress: number;
  todo: number;
};

export type Task = {
  _id: string;
  taskId: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  assigneeId?: {             
    name: string;
  };
};