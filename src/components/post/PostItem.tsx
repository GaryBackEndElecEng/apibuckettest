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
import { SeparatePara } from '@/lib/ultils';



export default function PostItem({ post, user }: { post: postType, user: userType }) {
    const router = useRouter();
    const handleLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        if (post.bloglink && post.bloglink.startsWith("/blogs")) {
            router.push(post.bloglink)
        } else if (post.bloglink && post.bloglink.startsWith("http")) {
            window.open(post.bloglink, "blank");
        }
    }

    return (
        <div className={`${styles.mainPostItemCard}`} >
            <h2 className={styles.cardTitle}>{post.name.toUpperCase()}</h2>
            <div onClick={(e) => handleLink(e)} className={styles.handleLink}>
                {post.imageUrl &&

                    <Image src={post.imageUrl} width={900} height={900}
                        alt={post.name}
                        className={styles.postImage}
                        priority
                        placeholder="blur"
                        blurDataURL={post.imageUrl}
                        onClick={(e) => handleLink(e)}
                    />

                }
                <h2> tap to view link</h2>
                <SeparatePara para={post.content} class_={"paraPost"} />
                <div className="line-break-sm" />
                <UserProfileTwo user={user} />
                <div className="line-break-sm" />
            </div>
            {post && <PostRatesLikes post={post} />}

            <div className="line-break-sm" />
        </div>
    )
}
