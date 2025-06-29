'use client'
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { title } from "process";
import { getWeek, set } from "date-fns";
import { get } from "http";
import { start } from "repl";

const SubmitShiftPage = () => {
    const [date, setDate] = useState<string>('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [note, setNote] = useState('')
    const [events, setEvents] = useState<any[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
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

    const getWeekday = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
        return new Intl.DateTimeFormat('ja-JP', options).format(date);
    }

    const isValidTime = (start: string, end: string): boolean => {
        return new Date(start) < new Date(end);
    }

    const handleAddShift = () => {
        if (!date || !startTime || !endTime) {
            alert('すべてのフィールドを入力してください')
            return
        }
        if (!isValidTime(`${date}T${startTime}`, `${date}T${endTime}`)) {
            alert('終了時間は開始時間より後でなければなりません');
            return;
        }
        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);
        setEvents([...events, {
            id: Date.now().toString(),
            title: note || '希望',
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString()
        }]);
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
        if (!isValidTime(`${date}T${startTime}`, `${date}T${endTime}`)) {
            alert('終了時間は開始時間より後でなければなりません');
            return;
        }
        const updatedEvent = events.map(event => event.id === selectedEvent.id ? {
            ...event,
            title: note || null,
            start: new Date(`${date}T${startTime}`),
            end: new Date(`${date}T${endTime}`)
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
            date: event.start.toISOString().split('T')[0], // 日付部分のみを抽出
            start_time: event.start.toTimeString().split(' ')[0], // 時間部分のみを抽出
            end_time: event.end.toTimeString().split(' ')[0], // 時間部分のみを抽出
        }));
        const { error } = await supabase.from('requested_shifts').insert(insertedEvents)
        if (error) {
            alert(`登録失敗:${error.message}`)
        } else {
            alert('希望シフトを提出しました')
            setEvents([]);
        }
    }

    const timeOptions: string[] = [];
    for (let hour = 9; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            timeOptions.push(time);
        }
    }

    return (
        <section className="max-w-3xl mx-auto p-6">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                dateClick={(info: any) => {
                    if (info.dateStr < new Date().toISOString().split('T')[0]) {
                        alert('過去の日付は選択できません');
                        return;
                    }

                    resetModal();
                    setDate(info.dateStr);
                    setShowModal(true);
                }}
                events={events}
                eventClick={(info: any) => {
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
                }}
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

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
                        <h2 className="text-lg text-black font-bold mb-4">{date}({getWeekday(date)})のシフトを提出</h2>
                        <div className="mb-4">
                            <label className="block text-sm text-black font-medium mb-2">開始時間</label>
                            <select className="border text-sm text-black border-gray-700 p-2 rounded w-full mb-2"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            >
                                <option value="">選択してください</option>
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>

                        </div>
                        <div className="mb-4">
                            <label className="block text-sm text-black font-medium mb-2">終了時間</label>
                            <select className="border text-sm text-black border-gray-700 p-2 rounded w-full mb-2"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            >
                                <option value="">選択してください</option>
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm text-black font-medium mb-2">備考</label>
                            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="border text-sm text-black border-gray-700 p-2 rounded w-full" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowModal(false)} className="px-3 py-1 text-black border-gray-700 rounded shadow">キャンセル</button>
                            {selectedEvent ? (
                                <div>
                                    <button onClick={handleEditShift} className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition">編集</button>
                                    <button onClick={handleDeleteShift} className="bg-red-700 text-white py-2 px-4 rounded shadow hover:bg-red-800 transition">削除</button>
                                </div>
                            ) : (
                                <button onClick={handleAddShift} className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition">確定</button>
                            )}
                        </div>
                    </div>
                </div>
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
