'use client'
import { useEffect, useState } from "react";
import { IssuedIdData } from "@/lib/utils/types";
import { supabase } from "@/lib/supabaseClient";

const ManageIds = () => {
    const [issuedIds, setIssuedIds] = useState<IssuedIdData[]>([])

    const generateIds = async () => {
        const issuedYearStr = new Date().getFullYear().toString();
        const randomNumberStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const issuedId = `UNRS${issuedYearStr}${randomNumberStr}`;

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
        <main>
            <h1>オーナー用ID管理ページ</h1>
        </main>
    );
}

export default ManageIds