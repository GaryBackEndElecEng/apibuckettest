"use client"
import React from 'react';
import type { generalInfoType } from "@lib/Types";
import styles from "./service.module.css";
import { useRouter } from "next/navigation";

export default function Service({ service }: { service: generalInfoType }) {
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
        <div className={styles.serviceCard}>
            <h2>{service.name}</h2>
            <p>{service.desc}</p>
            {service.url &&
                <div className={styles.linkContainer}>
                    <div onClick={(e) => handleLink(e, service.url)}
                    >
                        {service.url}
                    </div>
                </div>
            }
        </div>
    )
}
