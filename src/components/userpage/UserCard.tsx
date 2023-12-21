"use client";
import React from 'react';
import styles from "./userpage.module.css"
import { userType } from '@/lib/Types';
import Image from 'next/image';
import { useWindowSize } from "@lib/ultils";

export default function UserCard({ user }: { user: userType }) {
    const [Name, setName] = React.useState<string | null>(null);
    const url = "/images/gb_logo.png";
    const windowSize = useWindowSize()




    return (
        <div className={styles.mainUserpage}>
            {user &&
                <div className={styles.MainUserCard}>
                    <div>

                        <h3>{user && user.name}</h3>


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
export function firstLast(name: string) {
    let arrLet = name.split("");
    let newN: string = name;
    arrLet.forEach((let_, index) => {
        if (index > 0) {
            if (let_.toUpperCase() === let_) {
                newN = `${arrLet.slice(0, index).join("")} ${arrLet.slice(index, arrLet.length - 1).join("")}`

            }
        }
    });
    return newN

}
