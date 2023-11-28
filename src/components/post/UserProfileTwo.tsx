"use client"
import React from 'react';
import axios from "axios";
import styles from "@component/post/post.module.css";
import { getErrorMessage } from "@lib/errorBoundaries";
import { userType } from '@/lib/Types';
import Image from 'next/image';
import { NameSep } from '@/lib/ultils';


export default function UserProfile({ user }: { user: userType | undefined }) {
    const logo = "/images/gb_logo.png";


    return (
        <React.Fragment>
            {user && <div className={`${styles.userProfileTwo}`}>
                <h3 className="text-center text-xl mb-1">{user.name && NameSep(user.name)}</h3>
                <p>
                    {user.image ?
                        <Image src={user.image} width={75} height={75} alt="www.ablogroom.com" priority
                            className={styles.profileImage}
                        />
                        :
                        <Image src={logo} width={75} height={75} alt="www.ablogroom.com"
                            className={styles.profileImage}
                        />
                    }
                    {user.bio}
                </p>
            </div>}
        </React.Fragment>
    )
}


