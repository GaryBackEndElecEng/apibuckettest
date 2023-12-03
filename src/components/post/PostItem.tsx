"use client"
import { postType, userType } from '@/lib/Types'
import React from 'react';
import UserProfileTwo from "@component/post/UserProfileTwo";
import "@pages/globalsTwo.css";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import PostRatesLikes from '@component/post/PostRatesLikes';
import styles from "@component/post/post.module.css";
import Link from 'next/link';



export default function PostItem({ post, user }: { post: postType, user: userType }) {
    const router = useRouter();
    const handleLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        if (post.bloglink) {
            router.push(post.bloglink)
        }
    }

    return (
        <div className={`${styles.mainPostItemCard} cursor-pointer `} onClick={(e) => handleLink(e)}>
            <h2>{post.name}</h2>

            {post.imageUrl &&

                <Image src={post.imageUrl} width={900} height={600}
                    alt={post.name}
                    className={styles.postImage}
                    priority
                />

            }

            <p className="paraCreator">{post.content}</p>
            <div className="line-break-sm" />
            <UserProfileTwo user={user} />
            <div className="line-break-sm" />
            {post && <PostRatesLikes post={post} />}

            <div className="line-break-sm" />
        </div>
    )
}
