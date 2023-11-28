import React from 'react';
import MainPosts from "@component/dashboard/posts/MainPosts";
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import styles from "@component/dashboard/posts/posts.module.css";
import Login from "@component/comp/Login";

export default async function Posts() {
    const session = await getServerSession(authOptions);
    if (session) {
        return (
            <div className={styles.mainPagePosts}>
                <MainPosts session={session} />
            </div>
        )
    } else {
        return (
            <div className={styles.loginfix}>
                <Login />
            </div>

        )
    }
}

