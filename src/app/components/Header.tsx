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
        router.push('/')
    }

    return (
        <header className="w-full bg-gray-100 text-gray-800 shadow px-4 py-2 flex items-center justify-between relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 sm:hidden">
                <button
                    className="p-2 rounded-md hover:bg-gray-200 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="メニューを開く"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
                <Link href="/" className="text-2xl font-bold text-center sm:justify-center">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block sm:hidden">鰻の成瀬</span>
                    <span className="hidden sm:inline">鰻の成瀬　シフト管理アプリ</span>
                </Link >
                <nav className="hidden sm:flex gap-x-6 text-base">
                    <Link href="/submit/history" className="px-3 py-2 hover:bg-gray-200 rounded">提出履歴</Link>
                    <Link href="/schedule" className="px-3 py-2 hover:bg-gray-200 rounded">共有シフト</Link>
                    <Link href="/submit" className="px-3 py-2 hover:bg-gray-200 rounded">シフト提出</Link>
                </nav>
            </div>
            {userName ? (
                <div className="flex flex-col items-end justify-end gap-y-1 w-1/4">
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                        ログアウト
                    </button>
                    <span className="text-sm text-gray-600 justify-center flex">{userName}</span>
                </div>
            ) : null}
            {isOpen && (
                <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col gap-4 animate-slide-in">
                    <button
                        className="text-gray-600 hover:text-black"
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