
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Styles/Calendar.css';

export default function MyCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="rounded-2xl bg-white p-4 shadow">

      <Calendar onChange={setDate} value={date} />

      {/*<p className="mt-4 text-sm text-gray-600">
        선택한 날짜: {date.toLocaleDateString()}
      </p>*/}
    </div>
  );
}