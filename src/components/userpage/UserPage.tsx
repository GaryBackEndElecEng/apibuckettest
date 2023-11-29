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
    posts: postType[] | undefined
}
export default function UserPage({ user, files, posts }: userPageType) {
    //feed post & file detail to pages[id]

    const { setUserBlogs, userBlogs } = useBlogContext();
    const { userPosts, setUserPosts } = usePostContext();
    const { setUser } = useGeneralContext();

    React.useEffect(() => {
        if (files) {
            setUserBlogs(files);
        }
        if (posts) {
            setUserPosts(posts)
        }
        if (user) {
            setUser(user);
        }
    }, [files, posts, setUserBlogs, setUserPosts, user, setUser]);

    return (
        <div
            className={styles.userpage}
        >
            <div className={styles.userGrid}>
                <div>
                    <div className="line-break-sm" />
                    <h2 className="text-center text-2xl font-bold">{("Blogs").toUpperCase()}</h2>
                    <div className="line-break-sm" />
                    <div className={styles.blogCardContainer}>
                        <Suspense fallback="Loading....">
                            {userBlogs && userBlogs.map((file, index) => (
                                <React.Fragment key={index}>
                                    <Link href={`/blogs/${file.id}`}>
                                        <BlogCard file={file} />
                                    </Link>
                                </React.Fragment>
                            ))}
                        </Suspense>
                    </div>
                </div>
                <div>
                    <div className="line-break-sm" />
                    <h2 className="text-center text-2xl font-bold">{("Posts").toUpperCase()}</h2>
                    <div className="line-break-sm" />
                    <div className={styles.postCardContainer}>
                        <Suspense fallback="Loading....">
                            {userPosts && userPosts.map((post, index) => (
                                <React.Fragment key={index}>
                                    <Link href={`/posts/${post.id}`}>
                                        <PostCard post={post} />
                                    </Link>

                                </React.Fragment>
                            ))}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}
