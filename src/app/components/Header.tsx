'use client'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Header = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setUserEmail(session.user.email ?? null)
            }
        }
        getSession()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <header className="w-full p-4 bg-gray-100 flex justify-between items-center">
            <nav className="flex gap-x-6 text-base text-gray-800">
                <Link href="/" className="hover:underline" >トップ</Link>
                <Link href="/submit/history" className="hover:underline">提出履歴</Link>
                <Link href="/schedule" className="hover:underline">共有シフト</Link>
            </nav>
            {userEmail ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{userEmail}</span>
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