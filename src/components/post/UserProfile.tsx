"use client"
import React from 'react';
import axios from "axios";
import styles from "@component/post/post.module.css";
import { getErrorMessage } from "@lib/errorBoundaries";
import { userType } from '@/lib/Types';
import Image from 'next/image';
import { NameSep, firstUpper } from '@/lib/ultils';


export default function UserProfile({ user }: { user: userType | undefined }) {
    const logo = "/images/gb_logo.png";


    return (
        <React.Fragment>
            {user && <div className={`${styles.user}`}>
                <h3 className="text-center text-xl mb-1">{user.name && firstUpper(user.name)}</h3>
                {user.image ?
                    <Image src={user.image} width={75} height={75} alt="www.ablogroom.com" priority
                        placeholder="blur"
                        blurDataURL={user.image}
                    />
                    :
                    <Image src={logo} width={75} height={75} alt="www.ablogroom.com" priority
                        placeholder="blur"
                        blurDataURL={logo}
                    />
                }
            </div>}
        </React.Fragment>
    )
}


