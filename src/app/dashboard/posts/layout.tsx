
import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from "@component/dashboard/posts/posts.module.css";




const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Posts',
    description: 'Generated by create next app',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className={styles.dashPostsLayout}>

            {children}


        </main>
    )
}