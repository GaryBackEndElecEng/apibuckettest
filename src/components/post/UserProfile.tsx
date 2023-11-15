"use client"
import React from 'react';
import axios from "axios";
import styles from "@component/post/post.module.css";
import { getErrorMessage } from "@lib/errorBoundaries";
import { userType } from '@/lib/Types';
import Image from 'next/image';


export default function UserProfile({ userId }: { userId: string }) {
    const [user, setUser] = React.useState<userType | undefined>();
    React.useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await axios.get(`/api/user?userId=${userId}`);
                setUser(data);
            } catch (error) {
                console.error(getErrorMessage(error))
            }
        }
        if (userId) {
            getUser();
        }
    }, [userId]);

    return (
        <React.Fragment>
            {user && <div className={`${styles.user}`}>
                <h3 className="text-center text-xl mb-1">{user.name}</h3>
                <p className="prose prose-lg">
                    {user.image &&
                        <Image src={user.image} width={75} height={75} alt="www.ablogroom.com" />
                    }
                    {user.bio}
                </p>
            </div>}
        </React.Fragment>
    )
}
