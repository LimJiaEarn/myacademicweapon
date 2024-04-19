
"use client"

import { DayPicker } from 'react-day-picker';
import '@/components/css/calendar.css';


const Calendar = () => {
  return (
    <div className="">


        <DayPicker
          numberOfMonths={1}
          selected={new Date()}
          showOutsideDays
          weekStartsOn={1} // set monday as first day
        />   

    </div>
  )
}

export default Calendar