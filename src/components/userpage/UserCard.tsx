"use client";
import React from 'react';
import styles from "./userpage.module.css"
import { userType } from '@/lib/Types';
import Image from 'next/image';
import { firstUpper, useWindowSize } from "@lib/ultils";

export default function UserCard({ user }: { user: userType }) {
    const [Name, setName] = React.useState<string | null>(null);
    const url = "/images/gb_logo.png";
    const windowSize = useWindowSize()




    return (
        <div className={styles.mainUserpage}>
            {user &&
                <div className={styles.MainUserCard}>
                    <div>

                        <h3>{user && firstUpper(user.name as string)}</h3>


                        {user.image ?
                            <Image src={user.image} alt={user.name ? user.name : "www.ablogroom.com"} width={75} height={75}
                                placeholder="blur"
                                blurDataURL={user.image}
                            />
                            :
                            <Image src={url} alt={"www.ablogroom.com"} width={75} height={75}
                                placeholder="blur"
                                blurDataURL={url}
                            />
                        }
                    </div>
                    <div>
                        <p>{user.bio}</p>
                        <div className={styles.linebreak} />
                    </div>
                </div>
            }

        </div>
    )
}

