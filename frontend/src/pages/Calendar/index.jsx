import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import koLocale from '@fullcalendar/core/locales/ko';

function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks/calendar'); 
      const eventsData = res.data.tasks.map((task) => {
        const endDate = new Date(task.dueDate);
        endDate.setDate(endDate.getDate());

        return {
          id: task._id,
          title: task.title,
          start: task.createdAt,
          end: endDate,

          // 상태별 색상 (선택)
          backgroundColor:
            task.status === 'DONE'
              ? '#9CA3AF'
              : task.status === 'IN_PROGRESS'
              ? '#4CAF50'
              : '#819E7A',

          borderColor:
            task.status === 'DONE'
              ? '#9CA3AF'
              : task.status === 'IN_PROGRESS'
              ? '#4CAF50'
              : '#819E7A',
        };
      });
      setEvents(eventsData);
    } catch (err) {
      console.error('캘린더 데이터 불러오기 실패:', err);
    }
  };


  return (
    <div className="w-full min-h-screen bg-[#f8faf7] px-4 py-4 md:px-8 md:py-8">
      
      {/* 제목 */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Calendar</h1>
      </div>

      {/* 캘린더 */}
      <div className="bg-white rounded-2xl shadow-[0px_0px_4px_rgba(0,0,0,0.12)] p-3 md:p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={koLocale}
          height="75vh"

          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}

          events={events}

          // 클릭 이벤트 (선택)
          eventClick={(info) => {
            console.log('클릭한 task:', info.event.id);
          }}
        />
      </div>
    </div>
  );
}

export default CalendarPage;