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
type mainPostsType = {
    getuser: userType,
    getposts: postType[] | undefined
}

export default function MainPosts({ getuser, getposts }: mainPostsType) {

    const { userPosts, setUserPosts, setPostMsg, postMsg } = usePostContext();
    const { user, setUser } = useGeneralContext();

    // console.log("MainPosts=>getposts", getposts)

    React.useEffect(() => {
        if (!getuser) return
        setUser(getuser);
        if (!getposts) return
        setUserPosts(getposts);
        setPostMsg({ loaded: true, msg: "recieved" })
    }, [getuser, getposts, setUser, setUserPosts, setPostMsg]);




    return (
        <React.Fragment>
            <PostsDashboard user={user} posts={userPosts} />

            <div
                className={styles.mainPosts}
            >

                {userPosts &&
                    userPosts.map((post, index) => (
                        <React.Fragment key={index}>
                            <PostItem post={post} />
                        </React.Fragment>
                    ))}
            </div>
        </React.Fragment>
    )
}
