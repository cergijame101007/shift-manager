import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseAdminClient'

const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD

export const POST = async (req: Request) => {
    try {
        const { issuedId, name, password } = await req.json();

        if (!issuedId || !name || !password) {
            return NextResponse.json({ error: 'すべてのフィールドを入力してください' }, { status: 400 });
        }

        if (password !== LOGIN_PASSWORD) {
            return NextResponse.json({ error: 'パスワードが違います' }, { status: 403 })
        }

        const supabase = await createClient();

        const { data: issued, error: issuedError } = await supabase
            .from('issued_ids')
            .select('*')
            .eq('issued_id', issuedId)
            .eq('used', false)
            .single();

        if (issuedError || !issued) {
            return NextResponse.json({ error: '無効なIDです' }, { status: 400 })
        }

        const dummyEmail = `${issuedId}@dummy.local`
        const dummyPassword = issuedId

        const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
            email: dummyEmail,
            password: dummyPassword,
            email_confirm: true,
        })

        if (signUpError || !authData?.user) {
            return NextResponse.json({ message: '認証ユーザー作成に失敗しました' }, { status: 500 })
        }

        const userId = authData.user.id

        await supabase.from('users').insert({
            id: userId,
            name,
            email: dummyEmail,
            role: 'staff',
            level: 1,
        })

        await supabase.from('issued_ids').update({
            used: true,
            user_id: userId,
        })
            .eq('issued_id', issuedId)

        return NextResponse.json({
            message: '登録成功',
            email: dummyEmail,
            password: dummyPassword,
        })
    } catch (e: any) {
        console.error(e)
        return NextResponse.json({ error: '内部エラーが発生しました' }, { status: 500 })
    }
}
