'use client'
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const SubmitShiftPage = () => {
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [userId, setUserId] = useState<string | null>(null)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.from('requested_shifts').insert([
            {
                user_id: userId,
                date,
                start_time: startTime,
                end_time: endTime,
            }
        ])
        if (error) {
            alert(`登録失敗:${error.message}`)
        } else {
            alert('希望シフトを提出しました')
            setDate('')
            setStartTime('')
            setEndTime('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
            <h2 className="text-xl font-bold">希望シフト提出</h2>
            <div>
                <label className="block text-sm">日付</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border px-2 py-1" required />
            </div>
            <div>
                <label className="block text-sm">開始時間</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border px-2 py-1" required />
            </div>
            <div>
                <label className="block text-sm">終了時間</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border px-2 py-1" required />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">提出</button>
        </form>
    )
}

export default SubmitShiftPage
