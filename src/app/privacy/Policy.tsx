"use client";
import { generalInfoType } from '@/lib/Types'
import React from 'react'
import styles from "./privacy.module.css";
import { useRouter } from "next/navigation";

export default function Policy({ policy }: { policy: generalInfoType }) {
    const router = useRouter();

    const handleLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, link: string) => {
        e.preventDefault()
        if (link.startsWith("http")) {
            window.open(link, "blank");
        } else {
            router.push(link)
        }
    }
    return (
        <div className={styles.policyCard}>
            <h2>{policy.name}</h2>
            <p>{policy.desc}</p>
            {policy.url &&
                <div className={styles.linkContainer}>
                    <div onClick={(e) => handleLink(e, policy.url)}
                    >
                        {policy.url}
                    </div>
                </div>
            }
        </div>
    )
}
