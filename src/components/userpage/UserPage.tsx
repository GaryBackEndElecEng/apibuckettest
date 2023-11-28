"use client";
import { fileType, postType, userType } from '@/lib/Types';
import React from 'react';
import styles from "@component/userpage/userpage.module.css";
import { useBlogContext } from '../context/BlogContextProvider';
import { usePostContext } from '../context/PostContextProvider';
import UserCard from "./UserCard";
import BlogCard from "./BlogCard";
import PostCard from "./PostCard";
import Link from "next/link";

type userPageType = {
    user: userType,
    files: fileType[] | undefined,
    posts: postType[] | undefined
}
export default function UserPage({ user, files, posts }: userPageType) {
    //feed post & file detail to pages[id]

    const { setUserBlogs, userBlogs } = useBlogContext();
    const { userPosts, setUserPosts } = usePostContext();

    React.useEffect(() => {
        if (files) {
            setUserBlogs(files);
        }
        if (posts) {
            setUserPosts(posts)
        }
    }, [files, posts, setUserBlogs, setUserPosts]);

    return (
        <div
            className={styles.userpage}
        >
            <UserCard user={user} />
            <div className={styles.userGrid}>
                <div>
                    <h2>Blogs</h2>
                    <div className={styles.blogCardContainer}>
                        {userBlogs && userBlogs.map((file, index) => (
                            <React.Fragment key={index}>
                                <Link href={`/blogs/${file.id}`}>
                                    <BlogCard file={file} />
                                </Link>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div>
                    <h2>Posts</h2>
                    <div className={styles.postCardContainer}>
                        {userPosts && userPosts.map((post, index) => (
                            <React.Fragment key={index}>
                                <Link href={`/posts/${post.id}`}>
                                    <PostCard post={post} />
                                </Link>

                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
