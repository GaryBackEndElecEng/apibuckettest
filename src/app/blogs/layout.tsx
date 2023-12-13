
import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from "@component/blog/blog.module.css";
import BlogHeader from "./BlogHeader";


const inter = Inter({ subsets: ['latin'] })


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className={`${styles.blogsLayoutContainer} bg-slate-300`}>
            <BlogHeader />
            {children}


        </main>
    )
}