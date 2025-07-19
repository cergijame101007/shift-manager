'use client'
import { useEffect, useState } from "react";
import { IssuedIdData } from "@/lib/utils/types";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/app/components/Button";

const ManageIds = () => {
    const [issuedIds, setIssuedIds] = useState<IssuedIdData[]>([]);
    const [pendingIssueCount, setPendingIssueCount] = useState(1);

    const generateIds = async () => {
        const issuedYearStr = new Date().getFullYear().toString();
        const randomNumberStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const issuedId = `UNRS${issuedYearStr}${randomNumberStr}`;

        const newIds = Array.from({ length: pendingIssueCount }, () => ({
            issued_id: issuedId,
            used: false,
        }))

        const { error } = await supabase.from("issued_ids").insert(newIds)
        if (!error) await fetchIssuedIds()

        return issuedId
    }

    const fetchIssuedIds = async () => {
        const { data, error } = await supabase
            .from("issued_ids")
            .select(`id, issued_id, user_id, used, created_at, users(name)`)
            .order('created_at', { ascending: false });

        if (error) {
            alert(`"ID取得失敗" ${error.message}`);
            return;
        }

        if (data) {
            setIssuedIds(data);
            console.log(data)
        }
    }

    useEffect(() => {
        fetchIssuedIds()
    }, [])

    return (
        <main className="max-w-md mx-auto p-6 space-y-6">
            <h1>オーナー用ID管理ページ</h1>
            <table>
                <thead>
                    <tr>
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">使用者</th>
                        <th className="border px-2 py-1">使用日時</th>
                        <th className="border px-2 py-1">削除</th>
                    </tr>
                </thead>
                <tbody>
                    {issuedIds.map((row) => (
                        <tr key={row.id}>
                            <td className="border px-2 py-1">{row.issued_id}</td>
                            <td className="border px-2 py-1">{row.users?.[0]?.name ?? '未使用'}</td>
                            <td className="border px-2 py-1">{row.used ? new Date(row.created_at).toLocaleString() : '-'}</td>
                            <td className="border px-2 py-1 text-center">
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <select
                value={pendingIssueCount}
                onChange={e => setPendingIssueCount(parseInt(e.target.value))}
                className="w-full border px-3 py-2"
                required>
                <option value={1} className="text-black">件数を選択:通常は1</option>
                <option value={2} className="text-black">2</option>
                <option value={3} className="text-black">3</option>
                <option value={4} className="text-black">4</option>
                <option value={5} className="text-black">5</option>
                <option value={6} className="text-black">6</option>
                <option value={7} className="text-black">7</option>
            </select>
            <Button
                onClick={generateIds}
                className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition"
            >
                IDを発行
            </Button>
        </main>
    );
}

export default ManageIds