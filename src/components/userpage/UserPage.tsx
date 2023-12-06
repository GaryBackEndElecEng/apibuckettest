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
    const [select, setSelect] = React.useState<"blogs" | "posts" | "both">("both")

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
            {select !== "both" && <button className="buttonsm bg-slate-800 text-white mt-3 mb-1" onClick={() => setSelect("both")}>view all</button>}
            <div className={(select === "both" && files && posts) ? styles.userGrid : styles.userFlex}>
                {files && <MainBlogcard user={user} files={files} setSelect={setSelect} select={select} />}
                {posts && <MainPostcard user={user} posts={posts} setSelect={setSelect} select={select} />}
            </div>
        </div>
    )
}
