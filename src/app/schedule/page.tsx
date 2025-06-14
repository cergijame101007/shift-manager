'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState } from 'react'

const SchedulePage = () => {
    const [events, setEvents] = useState([
        {
            title: '山田',
            start: '2025-06-15T10:00:00',
            end: '2025-06-15T14:00:00',
        },
        {
            title: '佐藤',
            start: '2025-06-15T16:00:00',
            end: '2025-06-15T20:00:00',
        },
    ])

    return (
        <div className="p-4 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">共有シフトカレンダー</h1>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                height="auto"
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
        </div>
    )
}

export default SchedulePage

