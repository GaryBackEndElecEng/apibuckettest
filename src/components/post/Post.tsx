// "use client"
import type { postType, userType } from '@/lib/Types';
import Image from 'next/image';
import React from 'react';
import styles from "@component/post/post.module.css";
import getFormattedDate from "@lib/getFormattedDate";
import UserProfile from "@component/post/UserProfile";
import "@pages/globalsTwo.css";
import Link from "next/link";


export default function Post({ post, user }: { post: postType, user: userType | undefined }) {
    const logo = "/images/gb_logo.png";

    return (
        <div className={`mx-auto ${styles.card}`}>
            <h3 className="text-center mb-3">{post.name}</h3>
            <Link href={`/posts/${post.id}`} className="postLink">

                {post.imageUrl ?
                    <Image src={post.imageUrl} width={350} height={200} alt="www.ablogroom.com" style={{ width: "auto" }}
                        className={styles.postImage}
                    />
                    :
                    <Image src={logo} width={350} height={200} alt="www.ablogroom.com" style={{ width: "auto" }}
                        className={styles.postImage}
                    />
                }
                <p className="my-2 leading-8 w-1/2">
                    {post.content}
                </p>
                <UserProfile user={user} />
                <div className="flex flex-row mx-auto gap-2">
                    <small className="mx-auto p-1">{post.name}</small>
                    {post && post.date && <small className="mx-auto p-1">{getFormattedDate(post.date)}</small>}
                </div>
            </Link>
        </div>
    )
}
