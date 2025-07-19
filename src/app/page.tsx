'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Button from "@/app/components/Button"

const TopPage = () => {
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [issuedId, setIssuedId] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setIsLoggedIn(true)
      }
    }
    checkLogin()
  }, [])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const tempName = localStorage.getItem('tempName');

        if (tempName) {
          supabase.from('users').upsert({
            id: session.user.id,
            email: session.user.email,
            name: tempName,
            role: 'staff',
            level: 1,
          }, { onConflict: 'id' })
            .then(({ error }) => {
              if (error) {
                console.error('upsert error:', error.message)
              } else {
                localStorage.removeItem('tempName')
              }
            })
        }
        setIsLoggedIn(true)
        setMessage('ログインしました。')
      }
    })
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogin = async () => {
    if (!email || !name) {
      setMessage('メールアドレスと名前を入力してください')
      return
    }

    localStorage.setItem('tempName', name)

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage(`エラー: ${error.message}`)
    } else {
      setMessage('ログインリンクを送信しました。メールを確認してください。')
    }
  }

  const goToHistory = () => router.push('/submit/history')
  const goToSchedule = () => router.push('/schedule')
  const goToSubmit = () => router.push('/submit')

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">鰻の成瀬／シフト管理アプリ</h1>

      <section className="bg-gray-50 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">このアプリについて</h2>
        <p className="text-gray-700 leading-relaxed">
          このアプリは、スタッフが勤務希望シフトを提出し、オーナーが確定後、自動共有するためのシフト管理ツールです。
        </p>
        <p className="mt-2 text-gray-700">提出後は履歴画面で履歴を確認できます。</p>
      </section>

      {isLoggedIn ? (
        <section className="grid gap-4 sm:grid-cols-2">
          <Button
            onClick={goToHistory}
            className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition"
          >
            提出履歴を見る
          </Button>
          <Button onClick={goToSchedule}
            className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition"
          >
            共有シフトを見る
          </Button>
          <Button onClick={goToSubmit}
            className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition"
          >
            シフトを提出する
          </Button>
        </section>
      ) : (
        <>
          <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 mt-2"
          />
          <input
            type="text"
            placeholder="配布されたユーザーIDを入力"
            value={issuedId}
            onChange={(e) => setIssuedId(e.target.value)}
            className="w-full border px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="共通パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2"
            required
          />
          <Button
            onClick={handleLogin}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            認証して個人用画面を作成
          </Button>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </>
      )}
    </main>
  )
}

export default TopPage