"use client";
import React from 'react';
import CreatePost from "@component/dashboard/createPost/CreatePost";
import { Session } from 'next-auth';
import { useGeneralContext } from '@/components/context/GeneralContextProvider';
import { postType, userType } from '@/lib/Types';
import { usePostContext } from '@/components/context/PostContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import styles from "@component/dashboard/createPost/createpost.module.css"
import { useBlogContext } from '@/components/context/BlogContextProvider';
import toast from 'react-hot-toast';

type userFetchType = {
    user: userType,
    message: string
}
type mainCreateType = {
    getuser: userType,
    newpost: postType | undefined
}

export default function MainCreatePost({ getuser, newpost }: mainCreateType) {
    const { setUser, user } = useGeneralContext();
    const { setPostMsg, setPost, post, setUserPosts } = usePostContext();
    const { setUserBlogs } = useBlogContext();

    React.useEffect(() => {
        if (getuser) {
            setUser(getuser);
            setUserBlogs(getuser.files);
            setUserPosts(getuser.posts);
        }
        if (newpost) {
            setPost(newpost)
            toast.success("uploaded newPost")
        } else {
            toast.error("post not uploaded")
        }

    }, [setUser, setPostMsg, getuser, newpost, setPost, setUserPosts, setUserBlogs]);

    return (
        <div className={styles.mainCreatorPost}>
            <h2>Create a post</h2>
            <CreatePost user={user} post={post} />
        </div>

    )
}
