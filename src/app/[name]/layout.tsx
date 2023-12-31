
import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from "@component/userpage/userpage.module.css";
import UserHeader from "@component/userpage/UserHeader";
import GeneralContextProvider from "@/components/context/GeneralContextProvider";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'userPage',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className={styles.layoutContainer}>
            <GeneralContextProvider>
                <UserHeader />
                {children}
            </GeneralContextProvider>


        </main>
    )
}