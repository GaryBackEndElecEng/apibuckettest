"use client"
import React from 'react';
import styles from "@dashboard/dashboard.module.css";
import { GeneralContext } from '@context/GeneralContextProvider';
import { sendPageHit } from "@lib/fetchTypes";
import type { pageHitType, userType } from '@lib/Types';
import { usePathname } from "next/navigation";
import axios from "axios";
import { getErrorMessage } from "@lib/errorBoundaries";
import Link from "next/link";
import "@pages/globalsTwo.css";
import { Fab } from "@mui/material";
import CreateUser from "@/components/dashboard/UpdateUser";
import type { Session } from "next-auth";
import { useDashboardContext } from "@context/DashBoardContextProvider";
import GetMsg from "@component/comp/GetMsg";
import UpdateUser from '@/components/dashboard/UpdateUser';

type resType = { user: userType | null, status: number }

export default function DashBoard({ session }: { session: Session | null }) {
    const getUser = session ? session.user : null;
    const userEmail: string | null = session && session.user && session.user.email ? session.user.email : null;
    const { setUser, user, msg, setMsg } = useDashboardContext();


    React.useEffect(() => {
        const getuser = async () => {
            try {
                //UrlSearchParams=> only email
                const res = await fetch(`/api/dashuser?email=${userEmail}`);
                const body: resType | undefined = await res.json();
                if (body && body.user) {
                    setUser(body.user)
                    setMsg({ loaded: true, msg: "recieved" })
                }
                setMsg({ loaded: false, msg: "no user" })
            } catch (error) {
                console.error(`${getErrorMessage(error)}`);
                alert(`${getErrorMessage(error)}`)
            }
        }
        if (userEmail) {
            getuser()
        }
    }, [setUser, userEmail, setMsg]);


    return (
        <main className={styles.dashContainer}>
            <GetMsg />
            <div className={styles.gridThree}>
                <div className={styles.gridElement}>grid</div>
                <div className={styles.gridElement}>
                    <div className="flexrow">
                        <Link href={"/dashboard/createBlog"}>
                            <button className={`button.xs ${styles.buttonsm}`} >Create a blog</button>
                        </Link>
                        <Link href={"/dashboard/createPost"}>
                            <button className={`button.xs ${styles.buttonsm}`}>Create a post</button>
                        </Link>
                    </div>
                </div>
                <div className={styles.gridElement}>grid</div>
            </div>
            <div className="text-xl text-center my-1 mt-2 text-slate-200">Update profile</div>
            <UpdateUser />
        </main>
    )
}
