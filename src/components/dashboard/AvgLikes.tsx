"use client";
import React from 'react';
import { useLikes } from "@lib/ultils";
import { likeType } from '@/lib/Types';
import styles from "./dashboard.module.css";

export default function AvgLikes({ likes }: { likes: likeType[] }) {
    const iconLikes = useLikes(likes)
    return (
        <div className={styles.mainLikes}>
            {iconLikes && iconLikes.map((like, index) => (
                <div key={index} className={styles.likeFlex}>
                    <span className="icon">{like?.icon}</span>
                    <span>{like?.count}</span>
                </div>
            ))}
        </div>
    )
}
