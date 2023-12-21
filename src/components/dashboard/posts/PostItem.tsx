"use client";
import { postType } from '@/lib/Types'
import React from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import styles from "./posts.module.css"
import { getErrorMessage } from '@/lib/errorBoundaries';
import { usePostContext } from '@/components/context/PostContextProvider';
import { RiDeleteBin3Fill } from "react-icons/ri";
import { IconButton } from '@mui/material';
import toast from 'react-hot-toast';

type postItemType = {
    post: postType,

}
type fetchPostType = {
    post: postType,
    message: string
}

export default function PostItem({ post }: postItemType) {
    const router = useRouter();
    const { setUserPosts, userPosts, setPostMsg } = usePostContext();
    // console.log("postItem=>Post", post)

    const handleDeletePost = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post?postId=${post.id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                const body: fetchPostType = await res.json();
                const reduc = userPosts.filter(pos => (pos.id !== post.id));
                setUserPosts(reduc);
                // setPostMsg({ loaded: true, msg: body.message })
                toast.success(body.message)
            }
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@post@PostItem@delete`)
            toast.error(`something went wrong@ delete`)
        }

    }

    const handleRout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, post: postType) => {
        e.preventDefault();
        router.push(`/dashboard/posts/editpost?postId=${post.id}`)
    }
    return (
        <div className={styles.postItemMain}>
            {post &&
                <div className={styles.postItemSub}>
                    <IconButton onClick={(e) => handleDeletePost(e)}
                        className={styles.postDeleteBtn}
                    >
                        <RiDeleteBin3Fill />
                    </IconButton>
                    <h2>{post.name}</h2>
                    {post.imageUrl && <Image src={post.imageUrl} width={600} height={400} alt={post.name} priority
                        placeholder="blur"
                        blurDataURL={post.imageUrl}
                    />}
                    <p>{post.content}</p>

                    <button className={styles.btnPostItem} onClick={(e) => handleRout(e, post)}>edit</button>
                </div>
            }
        </div>
    )
}
