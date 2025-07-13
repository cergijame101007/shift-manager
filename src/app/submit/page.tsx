'use client'
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ShiftEvent } from "@/lib/utils/types"
import { isValidTime } from '@/lib/utils/files';

// import { title } from "process";
// import { getWeek, set } from "date-fns";
// import { get } from "http";
// import { start } from "repl";

import Calendar from '@/app/components/Calender';
import Modal from '@/app/components/Modal'

const SubmitShiftPage = () => {
    const [date, setDate] = useState<string>('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [note, setNote] = useState('')
    const [userId, setUserId] = useState<string | null>(null)

    const [events, setEvents] = useState<ShiftEvent[]>([])
    const [selectedEvent, setSelectedEvent] = useState<ShiftEvent | null>(null)

    const [showModal, setShowModal] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
            } else {
                setUserId(session.user.id)
            }
        }
        getUser()
    }, [])

    useEffect(() => {
        console.log('events:', events)
        console.log('selectedEvent:', selectedEvent)
    }, [events, selectedEvent])

    const handleAddShift = () => {
        if (!date || !startTime || !endTime) {
            alert('すべてのフィールドを入力してください')
            return
        }
        if (!isValidTime(new Date(`${date}T${startTime}`), new Date(`${date}T${endTime}`))) {
            alert('終了時間は開始時間より後でなければなりません');
            return;
        }

        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);

        const newEvent: ShiftEvent = {
            id: Date.now().toString(),
            title: note || '希望',
            start: startDateTime,
            end: endDateTime,
            note: note || ''
        }

        setEvents(prev => [...prev, newEvent]);
        setShowModal(false);
        setDate('');
        setStartTime('');
        setEndTime('');
        setNote('');
    }

    const handleEditShift = () => {
        if (!selectedEvent || !date || !startTime || !endTime) {
            alert('すべてのフィールドを入力してください');
            return;
        }
        if (!isValidTime(new Date(`${date}T${startTime}`), new Date(`${date}T${endTime}`))) {
            alert('終了時間は開始時間より後でなければなりません');
            return;
        }

        const newStartDateTime = new Date(`${date}T${startTime}`);
        const newEndDateTime = new Date(`${date}T${endTime}`);

        const updatedEvent = events.map(event => event.id === selectedEvent.id ? {
            ...event,
            title: note || '希望',
            start: newStartDateTime,
            end: newEndDateTime,
            note: note || ''
        } : event);

        setEvents(updatedEvent);
        resetModal();
    }

    const handleDeleteShift = () => {
        if (!selectedEvent) return;
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        resetModal();
    }

    const resetModal = () => {
        setSelectedEvent(null);
        setDate('');
        setStartTime('');
        setEndTime('');
        setNote('');
        setShowModal(false);
    }

    const handleSubmit = async () => {
        const insertedEvents = events.map(event => ({
            user_id: userId,
            date: event.start.toISOString().split('T')[0],
            start_time: event.start.toTimeString().split(' ')[0],
            end_time: event.end.toTimeString().split(' ')[0],
        }));
        const { error } = await supabase.from('requested_shifts').insert(insertedEvents)
        if (error) {
            alert(`登録失敗:${error.message}`)
        } else {
            alert('希望シフトを提出しました')
            setEvents([]);
        }
    }

    const handleDateClick = (info: any) => {
        if (info.dateStr < new Date().toISOString().split('T')[0]) {
            alert('過去の日付は選択できません');
            return;
        }

        resetModal();
        setDate(info.dateStr);
        setShowModal(true);
    }

    const handleEventClick = (info: any) => {
        if (info.event.start < new Date()) {
            alert('過去のシフトは編集できません');
            return;
        }
        setSelectedEvent({
            ...info.event.extendedProps,
            id: info.event.id,
            start: info.event.start,
            end: info.event.end,
            title: info.event.title
        });
        setDate(info.event.startStr.split("T")[0]);
        setStartTime(info.event.startStr.slice(11, 16));
        setEndTime(info.event.endStr.slice(11, 16));
        setNote(info.event.title !== '希望' ? info.event.title : '');
        setShowModal(true);
    }

    return (
        <section className="max-w-3xl mx-auto p-6">
            <Calendar
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
            />

            {showModal && (
                <Modal
                    date={date}
                    startTime={startTime}
                    endTime={endTime}
                    note={note}
                    selectedEvent={selectedEvent}
                    setStartTime={setStartTime}
                    setEndTime={setEndTime}
                    setNote={setNote}
                    handleAddShift={handleAddShift}
                    handleEditShift={handleEditShift}
                    handleDeleteShift={handleDeleteShift}
                    setShowModal={setShowModal}
                />
            )}
            <div className="mt-6">
                <button onClick={handleSubmit} className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition">
                    シフトを提出する
                </button>
            </div>
        </section>

    )
}

export default SubmitShiftPage
