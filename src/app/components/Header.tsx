'use client'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const Header = () => {
    const [userName, setUserName] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
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
        <header className="w-full bg-gray-100 text-gray-800 shadow p-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">鰻の成瀬</Link >
            <nav className="hidden sm:flex gap-x-6 text-base">
                <Link href="/submit/history" className="px-3 py-2 hover:bg-gray-200 rounded">提出履歴</Link>
                <Link href="/schedule" className="px-3 py-2 hover:bg-gray-200 rounded">共有シフト</Link>
                <Link href="/submit" className="px-3 py-2 hover:bg-gray-200 rounded">シフト提出</Link>
            </nav>
            <div className="flex-1 flex justify-end items-center gap-4">
                <button
                    className="sm:hidden p-2 rounded-md hover:bg-gray-200"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="メニューを開く"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {userName ? (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{userName}</span>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                        ログアウト
                    </button>
                </div>
            ) : null}
            {isOpen && (
                <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col gap-4 sm:hidden animate-slide-in">
                    <button
                        className="self-end text-gray-600 hover:text-black"
                        onClick={() => setIsOpen(false)}
                        aria-label="閉じる"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <Link href="/" onClick={() => setIsOpen(false)}>トップ</Link>
                    <Link href="/submit/history" onClick={() => setIsOpen(false)}>提出履歴</Link>
                    <Link href="/schedule" onClick={() => setIsOpen(false)}>共有シフト</Link>
                    <Link href="/submit" onClick={() => setIsOpen(false)}>シフト提出</Link>
                </div>
            )}
        </header>
    )
}

export default Header