import React from 'react';
import type { userType, fileType, postType } from "@lib/Types";
import MainCreatBlog from "@/components/dashboard/createblog/MainCreatBlog";
import { Session, getServerSession } from 'next-auth';
import authOptions from "@lib/authOptions";
import { redirect } from "next/navigation";
import Login from "@component/comp/Login";
import styles from "@component/dashboard/createblog/createablog.module.css";


export default async function page() {
    const session = await getServerSession(authOptions);
    const mainStyle = "lg:container mx-auto px-2 py-2";
    if (session) {

        return (
            <div className={mainStyle}>
                <MainCreatBlog session={session} />
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
