
import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from "@component/post/post.module.css";



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Post Detail',

}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className={styles.layoutSinglePostContainer}>

            {children}


        </main>
    )
}