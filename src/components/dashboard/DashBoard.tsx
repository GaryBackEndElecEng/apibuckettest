"use client"
import React from 'react';
import styles from "@dashboard/dashboard.module.css";
import { GeneralContext } from '@context/GeneralContextProvider';
import { sendPageHit } from "@lib/fetchTypes";
import type { pageHitType } from '@lib/Types';
import { usePathname } from "next/navigation";
import axios from "axios";
import { getErrorMessage } from "@lib/errorBoundaries";



export default function DashBoard() {
    const pathname = usePathname();

    React.useEffect(() => {
        if (!pathname) return
        const params: pageHitType = { name: "none", page: pathname }
        const sendPgHit = async () => {
            try {
                const { data } = await axios.post(`/api/pagehit`, params);
                const body: pageHitType = data;
                console.log(body)
            } catch (error) {
                let message: string = `${getErrorMessage(error)}@api/page-hit`
                console.error(message)
            }
        }
        // sendPgHit();
    }, []);

    return (
        <div>DashBoard</div>
    )
}
