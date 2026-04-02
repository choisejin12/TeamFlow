import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Styles/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function MyCalendar() {
  const [date, setDate] = useState<Value>(new Date());

  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <Calendar
        onChange={(value) => setDate(value as Value)} 
        value={date}
      />
    </div>
  );
}