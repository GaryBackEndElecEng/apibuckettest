import React from 'react';
import { userType } from "@lib/Types"
import Image from 'next/image';
import "@pages/globalsTwo.css";
import styles from "@component/blog/blog.module.css";
import { NameSep } from "@lib/ultils";

export default function UserCardTwo({ user }: { user: userType | undefined }) {
    return (
        <>
            {user &&
                <div className={styles.userCard}>
                    <div className="flexrowsm">
                        {user.name && user.image && <Image src={user.image} width={50} height={50} alt={user.name} className={styles.profileImage} />}
                        {user.name && <h3>{NameSep(user.name)}</h3>}
                    </div>
                    <div className="line-break-sm" />


                </div>
            }
        </>
    )
}