export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  _id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  dueDate: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: Date;
  backgroundColor: string;
  borderColor: string;
}