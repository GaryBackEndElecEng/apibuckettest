"use client";
import { fileType, postType, userType } from '@/lib/Types';
import React from 'react';
import styles from "@component/userpage/userpage.module.css";
import { useBlogContext } from '../context/BlogContextProvider';
import { usePostContext } from '../context/PostContextProvider';
import { Suspense } from "react";

import PostCard from "./PostCard";
import Link from "next/link";
import { useGeneralContext } from '../context/GeneralContextProvider';

type userPageType = {
    user: userType,
    posts: postType[] | undefined,
    setSelect: React.Dispatch<React.SetStateAction<"blogs" | "posts" | "both">>,
    select: "blogs" | "posts" | "both"
}
export default function MainPostcard({ user, posts, select, setSelect }: userPageType) {
    //feed post & file detail to pages[id]

    const { setUserBlogs, userBlogs } = useBlogContext();
    const { userPosts, setUserPosts } = usePostContext();
    const { setUser } = useGeneralContext();

    React.useEffect(() => {

        if (posts) {
            setUserPosts(posts)
        }

    }, [posts, setUserPosts]);

    const showGrid = (select === "posts" || select === "both") ? styles.mainUsercard : styles.mainhideusercard;
    const dataView = "view posts";

    return (
        <div
            className={showGrid}
        >
            <div onClick={() => setSelect("posts")} style={{ cursor: "pointer" }} className={styles.clickPosts} data-view={dataView}>
                <div className="line-break-sm" />
                <h2 className="text-center text-2xl font-bold">{("Posts").toUpperCase()}</h2>
                <div className="line-break-sm" />
            </div>

            <div className={select === "posts" ? styles.postGrid : styles.blogCardContainer}>
                <Suspense fallback="Loading....">
                    {userPosts && userPosts.map((post, index) => (
                        <React.Fragment key={index}>
                            <PostCard post={post} />
                        </React.Fragment>
                    ))}
                </Suspense>
            </div>


        </div>
    )
}