"use client";
import { usePostContext } from '@/components/context/PostContextProvider';
import React from 'react';
import styles from "@component/dashboard/posts/posts.module.css";
import PostItem from "./PostItem";
import { useGeneralContext } from '@/components/context/GeneralContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { postType, userType } from '@/lib/Types';
import PostsDashboard from "@component/dashboard/posts/PostsDashboard";
import { Session } from 'next-auth';

type postsfetchType = {
    posts: postType[],
    message: string
}
type userfetchType = {
    user: userType,
    message: string
}

export default function MainPosts({ session }: { session: Session | null }) {

    const { posts, setPosts, setPostMsg } = usePostContext();
    const { user, setUser } = useGeneralContext();
    //--getting user--///
    React.useEffect(() => {
        if (session && session.user && session.user.email) {
            const getUser = async () => {
                const email = session.user?.email
                try {
                    const res = await fetch(`/api/useremail?email=${email}`);
                    if (res.ok) {
                        const body: userfetchType = await res.json();
                        setPostMsg({ loaded: true, msg: body.message });
                        setUser(body.user);
                    }
                } catch (error) {
                    const message = getErrorMessage(error);
                    console.error(`${message}@useremail`);
                    setPostMsg({ loaded: false, msg: message })
                }
            }
            getUser();
        }
    }, [session, setUser, setPostMsg]);

    //-----USERS POSTS-------//

    React.useEffect(() => {

        const getPosts = async () => {
            if (user) {
                try {
                    const res = await fetch(`/api/userposts?userId=${user.id as string}`);

                    if (res.ok) {
                        const body: postsfetchType = await res.json();
                        setPosts(body.posts);
                        setPostMsg({ loaded: true, msg: body.message });
                    }
                } catch (error) {
                    const message = getErrorMessage(error);
                    console.error(`${message}@posts`);
                    setPostMsg({ loaded: false, msg: message })
                }
            }
        }
        getPosts()
    }, [user, setPosts, setPostMsg]);


    return (
        <React.Fragment>
            <PostsDashboard />

            <div
                className={styles.mainPosts}
            >

                {posts &&
                    posts.map((post, index) => (
                        <React.Fragment key={index}>
                            <PostItem post={post} />
                        </React.Fragment>
                    ))}
            </div>
        </React.Fragment>
    )
}
