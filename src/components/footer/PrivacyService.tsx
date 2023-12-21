"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import styles from "./footer.module.css"

export default function PrivacyService({ open }: { open: boolean }) {
    const router = useRouter();
    const handleroute = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, link: string) => {
        e.preventDefault();
        router.push(link);

    }
    return (
        <div className={open ? styles.privacyService : styles.hidePrivServ}>
            <button onClick={(e) => handleroute(e, "/privacy")}>
                privacy policy
            </button>
            <button onClick={(e) => handleroute(e, "/termsofservice")}>
                terms of service
            </button>
        </div>
    )
}
