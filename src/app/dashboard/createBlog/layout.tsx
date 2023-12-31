
import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from "@component/dashboard/createblog/createablog.module.css";
import GeneralContextProvider from "@/components/context/GeneralContextProvider";
import BlogContextProvider from "@/components/context/BlogContextProvider";




const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Create blog',
    description: 'Generated by create next app',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className={styles.createaBlogLayout}>
            <GeneralContextProvider>
                <BlogContextProvider>
                    {children}
                </BlogContextProvider>
            </GeneralContextProvider>


        </main>
    )
}