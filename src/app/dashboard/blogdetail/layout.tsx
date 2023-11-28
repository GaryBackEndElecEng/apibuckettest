
import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from "@component/dashboard/blogdetail/blogdetailStyle.module.css";



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Blog Detail',
    description: 'Generated by Gary Wallace',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className={styles.detailLayoutContainer}>

            {children}


        </main>
    )
}