"use client";
import React from 'react';
import { userType } from "@lib/Types"
import Image from 'next/image';
import "@pages/globalsTwo.css";
import styles from "@component/home/home.module.css";
import { useRouter } from "next/navigation";
import { NameSep, firstUpper, separateName } from "@lib/ultils";
import { Ephesis } from 'next/font/google';
const ephesis = Ephesis({ subsets: ['latin'], weight: "400" });


export default function UserCard({ user }: { user: userType }) {
    const image: string | null = user.imgKey ? user.image : "/images/logo_125.png";
    const router = useRouter();
    const handleRoute = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        router.push(`/${user.name}`);
    }

    return (
        <>
            {user &&
                <div className={styles.userCard} onClick={(e) => handleRoute(e)}>
                    <h3 className={ephesis.className}>{user.name && firstUpper(separateName(user.name))}</h3>
                    <p style={{ color: "white", background: "black" }}>

                        {user.name && image && <Image src={image} width={75} height={75} alt={user.name} className={styles.profileImage}
                            placeholder="blur"
                            blurDataURL={image}
                        />}
                        {user.bio}
                    </p>

                </div>
            }
        </>
    )
}
