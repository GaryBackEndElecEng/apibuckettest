import React from 'react';
import { userType } from "@lib/Types"
import Image from 'next/image';
import "@pages/globalsTwo.css";
import styles from "@component/blog/blog.module.css";
import { separateName } from '@/lib/ultils';

export default function UserCard({ user }: { user: userType | null }) {

    return (
        <>
            {user &&
                <div className={styles.userCard}>
                    <h3>{user && user.name}</h3>
                    <p style={{ color: "white", background: "black" }}>

                        {user.name && user.image && <Image src={user.image} width={50} height={50} alt={user.name} className={styles.profileImage} />}
                        {user.bio}
                    </p>

                </div>
            }
        </>
    )
}
