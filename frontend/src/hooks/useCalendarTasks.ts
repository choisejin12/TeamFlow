import { useQuery } from '@tanstack/react-query';
import { fetchCalendarTasks } from '../api/calendar';
import { CalendarEvent } from '../types/calendar';

const mapToEvents = (tasks: any[]): CalendarEvent[] => {
  return tasks.map((task) => {
    const endDate = new Date(task.dueDate);
    endDate.setDate(endDate.getDate());

    const color =
      task.status === 'DONE'
        ? '#9CA3AF'
        : task.status === 'IN_PROGRESS'
        ? '#4CAF50'
        : '#819E7A';

    return {
      id: task._id,
      title: task.title,
      start: task.createdAt,
      end: endDate,
      backgroundColor: color,
      borderColor: color,
    };
  });
};

export const useCalendarTasks = () => {
  return useQuery({
    queryKey: ['calendarTasks'],
    queryFn: fetchCalendarTasks,
    select: mapToEvents, // 👉 여기서 변환
  });
};