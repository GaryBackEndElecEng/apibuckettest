"use client";
import { postType } from '@/lib/Types'
import React from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import styles from "./posts.module.css"

type postItemType = {
    post: postType,

}

export default function PostItem({ post }: postItemType) {
    const router = useRouter();


    const handleRout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, post: postType) => {
        e.preventDefault();
        router.push(`/dashboard/posts/editpost?id=${post.id}`)
    }
    return (
        <div className={styles.postItemMain}>
            {post &&
                <div className={styles.postItemSub}>
                    <h2>{post.name}</h2>
                    {post.imageUrl && <Image src={post.imageUrl} width={600} height={400} alt={post.name} />}
                    <p>{post.content}</p>

                    <button className={styles.btnPostItem} onClick={(e) => handleRout(e, post)}>edit</button>
                </div>
            }
        </div>
    )
}
