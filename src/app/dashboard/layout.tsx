
import React from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from "@component/dashboard/dashboard.module.css";




const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Generated by create next app',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className={styles.dashboardLayout}>

            {children}


        </main>
    )
}