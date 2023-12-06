"use client";
import React from 'react';
import { userType } from "@lib/Types"
import Image from 'next/image';
import "@pages/globalsTwo.css";
import styles from "@component/blog/blog.module.css";
import { useRouter } from "next/navigation";

export default function UserCard({ user }: { user: userType }) {
    const router = useRouter();

    const handleRoute = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        router.push(`/${user.name}`);
    }

    return (
        <>
            {user &&
                <div className={styles.userCard} onClick={(e) => handleRoute(e)}>
                    <h3>{user.name}</h3>
                    <p style={{ color: "white", background: "black" }}>

                        {user.name && user.image && <Image src={user.image} width={50} height={50} alt={user.name} className={styles.profileImage} />}
                        {user.bio}
                    </p>

                </div>
            }
        </>
    )
}
