import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarProps } from "@/lib/utils/types";
import React from "react";

const Calendar: React.FC<CalendarProps> = ({ events, onDateClick, onEventClick }) => {
    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={onDateClick}
            events={events}
            eventClick={onEventClick}
            eventContent={(arg) => {
                return (
                    <div className="text-black text-xs truncate">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {arg.event.title}
                    </div>
                )
            }}
            height={"auto"}
            dayHeaderContent={(arg) => {
                const day = arg.date.getDay()
                const color = day === 0 ? 'red' : day === 6 ? 'blue' : 'black'
                return <span style={{ color }}>{arg.text}</span>
            }}
            dayCellContent={(arg) => {
                const day = arg.date.getDay()
                const color = day === 0 ? 'red' : day === 6 ? 'blue' : 'black'
                return <div style={{ color }}>{arg.dayNumberText}</div>
            }}
        />
    );
};

export default Calendar;