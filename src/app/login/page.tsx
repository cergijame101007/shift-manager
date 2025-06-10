'use client'
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Session } from "inspector/promises";

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push('/submit/history')
            }
        }
        checkSession()
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            setMessage(`エラー: ${error.message}`)
        } else {
            setMessage(`ログインリンクをメールで送信しました。メールを確認してください。\n迷惑メールに入っている場合がありますので、そちらも確認してください。`)
        }
    }

    useEffect(() => {
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                router.push('/submit/history')
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto p-6 space-y-4">
            <h2 className="text-xl font-bold">ログイン</h2>
            <input
                type="email"
                placeholder="メールアドレスを入力"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border px-2 py-1" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">認証用リンクを送信</button>
            {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
        </form>
    )
}

export default LoginPage