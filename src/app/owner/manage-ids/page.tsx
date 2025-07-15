'use client'
import { useEffect, useState } from "react";
import { IssuedIdData } from "@/lib/utils/types";
import { supabase } from "@/lib/supabaseClient";

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

    const showIds = async () => {
        const id = await generateIds()
        console.log(id);
    }

    useEffect(() => {
        fetchIssuedIds()
    }, [])

    return (
        // <button onClick={showIds}>
        //     push
        // </button>
        <main className="max-w-md mx-auto p-6 space-y-6">
            <h1>オーナー用ID管理ページ</h1>
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
        </main>
    );
}

export default ManageIds