
import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from "@component/post/post.module.css";
import PostHeader from "@component/post/PostHeader"



const inter = Inter({ subsets: ['latin'] })



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className={`${styles.layoutPostsContainer} bg-slate-300`}>
            <PostHeader />
            {children}


        </main>
    )
}