"use client"
import React from 'react';
import styles from "@dashboard/dashboard.module.css";
import type { userType } from '@lib/Types';
import { getErrorMessage } from "@lib/errorBoundaries";
import Link from "next/link";
import "@pages/globalsTwo.css";

import type { Session } from "next-auth";
import { useBlogContext } from "@/components/context/BlogContextProvider";
import BlogMsg from "@component/dashboard/createblog/BlogMsg";
import UpdateUser from '@/components/dashboard/UpdateUser';
import { useGeneralContext } from '../context/GeneralContextProvider';
import UserBlogs from "@dashboard/UserBlogs"

type resType = { user: userType | null, message: string }

export default function DashBoard_({ session }: { session: Session | null }) {
    const getUser = session ? session.user : null;
    const userEmail: string | null = session && session.user && session.user.email ? session.user.email : null;

    const { setUser, user } = useGeneralContext();
    const { setBlogMsg, blogMsg } = useBlogContext()

    React.useEffect(() => {
        const getuser = async () => {
            try {
                //UrlSearchParams=> only email
                const res = await fetch(`/api/useremail?email=${userEmail}`);
                const body: resType | undefined = await res.json();
                if (res.ok && body) {

                    setUser(body.user)
                    setBlogMsg({ loaded: true, msg: body.message })

                } else if (res.status > 200 && res.status < 500) {
                    setBlogMsg({ loaded: false, msg: body && body.message })
                }

            } catch (error) {
                console.error(`${getErrorMessage(error)}`);
                alert(`${getErrorMessage(error)}`)
            }
        }
        if (userEmail) {
            getuser()
        }
    }, [setUser, userEmail, setBlogMsg]);

    return (
        <main className={styles.dashContainer}>
            <BlogMsg />
            <div className={styles.gridThree}>
                <div className={styles.gridElement}>grid</div>
                <div className={styles.gridElement}>
                    <div className="flexrow">
                        <Link href={"/dashboard/createBlog"}>
                            <button className={`button.xs ${styles.buttonsm}`} >Create a blog</button>
                        </Link>
                        <h2>create edit blog within list</h2>
                        <Link href={"/dashboard/createPost"}>
                            <button className={`button.xs ${styles.buttonsm}`}>Create a post</button>
                        </Link>
                    </div>
                </div>
                <div className={styles.gridElement}>grid</div>
            </div>
            <div className="text-xl text-center my-1 mt-2 text-slate-200">Update profile</div>
            <details>
                <summary className={styles.userSummary}>Profile Update</summary>
                <UpdateUser user={user} />
            </details>
            <UserBlogs user={user} />
        </main>
    )
}
