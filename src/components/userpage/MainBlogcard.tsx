"use client";
import { fileType, postType, userType } from '@/lib/Types';
import React from 'react';
import styles from "@component/userpage/userpage.module.css";
import { useBlogContext } from '../context/BlogContextProvider';
import { usePostContext } from '../context/PostContextProvider';
import { Suspense } from "react";

import BlogCard from "./BlogCard";
import PostCard from "./PostCard";
import Link from "next/link";
import { useGeneralContext } from '../context/GeneralContextProvider';

type userPageType = {
    user: userType,
    files: fileType[] | undefined,
    setSelect: React.Dispatch<React.SetStateAction<"blogs" | "posts" | "both">>,
    select: "blogs" | "posts" | "both"

}
export default function MainBlogcard({ user, files, select, setSelect }: userPageType) {
    //feed post & file detail to pages[id]

    const { setUserBlogs, userBlogs } = useBlogContext();
    const { userPosts, setUserPosts } = usePostContext();
    const { setUser } = useGeneralContext();

    React.useEffect(() => {
        if (files) {
            setUserBlogs(files);
        }

    }, [files, setUserBlogs]);

    const showGrid = (select === "blogs" || select === "both") ? styles.mainUsercard : styles.mainhideusercard;
    const dataView = "view blogs";

    return (
        <div
            className={showGrid}
        >
            <div onClick={() => setSelect("blogs")} style={{ cursor: "pointer" }} className={styles.clickBlogs} data-view={dataView}>
                <div className="line-break-sm" />
                <h2 className="text-center text-2xl font-bold">{("Blogs").toUpperCase()}</h2>
                <div className="line-break-sm" />
            </div>
            <div className={select === "blogs" ? styles.blogGrid : styles.blogCardContainer}>
                <Suspense fallback="Loading....">
                    {userBlogs && userBlogs.map((file, index) => {
                        if (file.published === true) {
                            return (
                                <React.Fragment key={index}>

                                    <BlogCard file={file} />

                                </React.Fragment>
                            )
                        }
                    })}
                </Suspense>
            </div>



        </div>
    )
}