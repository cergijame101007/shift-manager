'use client'
import { useState } from 'react'
import Calendar from '@/app/components/Calender'
import { ShiftEvent } from "@/lib/utils/types"

const SchedulePage = () => {
    const [events, setEvents] = useState<ShiftEvent[]>([
        {
            id: '1',
            title: '山田',
            start: new Date('2025-06-15T10:00:00'),
            end: new Date('2025-06-15T14:00:00'),
        },
        {
            id: '2',
            title: '佐藤',
            start: new Date('2025-06-15T16:00:00'),
            end: new Date('2025-06-15T20:00:00'),
        },
    ])

    const handleDateClick = (info: any) => {
        return
    }

    const handleEventClick = (info: any) => {
        return

    }
    return (
        <section className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">共有シフトカレンダー</h1>
            <Calendar
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
            />
        </section>
    )
}

export default SchedulePage

