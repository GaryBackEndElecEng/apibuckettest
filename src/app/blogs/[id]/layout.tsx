
import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from "@component/blog/blog.module.css";
import GeneralContextProvider from "@/components/context/GeneralContextProvider";



const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <GeneralContextProvider>
            <main className={styles.blogSIngleIDLayoutContainer}>

                {children}


            </main>
        </GeneralContextProvider>
    )
}