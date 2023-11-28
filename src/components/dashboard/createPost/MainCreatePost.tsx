"use client";
import React from 'react';
import CreatePost from "@component/dashboard/createPost/CreatePost";
import { Session } from 'next-auth';
import { useGeneralContext } from '@/components/context/GeneralContextProvider';
import { userType } from '@/lib/Types';
import { usePostContext } from '@/components/context/PostContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import styles from "@component/dashboard/createPost/createpost.module.css"

type userFetchType = {
    user: userType,
    message: string
}

export default function MainCreatePost({ session }: { session: Session }) {
    const { user, setUser } = useGeneralContext();
    const { setPostMsg } = usePostContext();

    React.useEffect(() => {
        if (!user && session.user?.email) {
            const email = session.user?.email
            const getUser = async () => {
                try {
                    const res = await fetch(`/api/useremail?email=${email}`);
                    const body: userFetchType = await res.json();
                    if (res.ok) {
                        setUser(body.user);
                        setPostMsg({ loaded: true, msg: body.message })
                    }
                } catch (error) {
                    const message = getErrorMessage(error);
                    console.error(`${message}@useremail`);
                    setPostMsg({ loaded: false, msg: message })
                }
            }
            getUser();
        }
    }, [user, setUser, setPostMsg, session]);

    return (
        <div className={styles.mainCreatorPost}>
            <h2>Create a post</h2>
            <CreatePost user={user} />
        </div>

    )
}
