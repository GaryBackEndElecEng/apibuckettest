import React from 'react';
import { Session, getServerSession } from 'next-auth';
import authOptions from "@lib/authOptions";
import Login from "@component/comp/Login";
import MasterEditBlog from "@component/dashboard/editblog/MasterEditBlog";
import styles from "@component/dashboard/editblog/editblog.module.css";

export default async function page() {
    const session = await getServerSession(authOptions);
    if (session) {
        return (
            <div>
                <MasterEditBlog session={session} />
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

