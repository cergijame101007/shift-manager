'use client'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Header = () => {
    const [userName, setUserName] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const getUserName = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (sessionError) {
                console.error('セッション取得エラー:', sessionError.message)
                return
            }

            const userId = session?.user.id
            if (!userId) return

            const { data, error } = await supabase.from('users').select('name').eq('id', userId).single()

            if (error) {
                console.error('ユーザー名取得エラー:', error.message)
            } else {
                setUserName(data.name)
            }
        }
        getUserName()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/app')
    }

    return (
        <header className="w-full p-4 bg-gray-100 flex justify-between items-center">
            <nav className="flex gap-x-6 text-base text-gray-800">
                <Link href="/" className="hover:underline" >トップ</Link>
                <Link href="/submit/history" className="hover:underline">提出履歴</Link>
                <Link href="/schedule" className="hover:underline">共有シフト</Link>
                <Link href="/submit" className="hover:underline">シフト提出</Link>
            </nav>
            {userName ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{userName}</span>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                        ログアウト
                    </button>
                </div>
            ) : null}
        </header>
    )
}

export default Header