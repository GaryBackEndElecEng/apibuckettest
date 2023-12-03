"use client";
import { fileType, postType, userType } from '@/lib/Types';
import React from 'react';
import styles from "@component/userpage/userpage.module.css";
import { useBlogContext } from '../context/BlogContextProvider';
import { usePostContext } from '../context/PostContextProvider';
import { Suspense } from "react";
import MainBlogcard from "./MainBlogcard";
import MainPostcard from "./MainPostcard";
import BlogCard from "./BlogCard";
import PostCard from "./PostCard";
import Link from "next/link";
import { useGeneralContext } from '../context/GeneralContextProvider';

type userPageType = {
    user: userType,
    files: fileType[] | undefined,
    posts: postType[] | undefined
}
export default function UserPage({ user, files, posts }: userPageType) {
    //feed post & file detail to pages[id]

    const { setUserBlogs, userBlogs } = useBlogContext();
    const { userPosts, setUserPosts } = usePostContext();
    const { setUser } = useGeneralContext();

    React.useEffect(() => {
        if (user) {
            setUser(user);
        }
    }, [user, setUser]);

    return (
        <div
            className={styles.userpage}
        >
            <div className={styles.userGrid}>
                <MainBlogcard user={user} files={files} />
                <MainPostcard user={user} posts={posts} />
            </div>
        </div>
    )
}
