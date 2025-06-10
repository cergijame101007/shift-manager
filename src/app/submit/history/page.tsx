'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const SubmitHistoryPage = () => {
    const router = useRouter()
    const [shifts, setShifts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    async (event, session) => {
                        if (event === 'SIGNED_IN' && session) {
                            await loadData()
                        } else {
                            router.push('/login')
                        }
                    }
                )
                return () => subscription.unsubscribe()
            }

            const userId = session.user.id
            const { data, error } = await supabase
                .from('requested_shifts')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: true })

            if (!error) setShifts(data)
            setLoading(false)
        }

        loadData()
    }, [])

    if (loading) return <p className="p-4">読み込み中...</p>

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">提出済みシフト履歴</h2>
            {shifts.length === 0 ? (
                <p>まだ提出されたシフトはありません。</p>
            ) : (
                <ul className="space-y-2">
                    {shifts.map((shift) => (
                        <li key={shift.id} className="border p-2 rounded">
                            {shift.date} / {shift.start_time} ~ {shift.end_time}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SubmitHistoryPage
