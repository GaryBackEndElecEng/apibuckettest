"use client"
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import styles from "@component/dashboard/dashboard.module.css";

export default function DashSignup() {
    // const { data: session } = useSession()
    const main = "flex flex-col sm:flex-row justify-end items-center gap-3";



    const textStyle = " text-white text-center mb-3 underline underline-offset-[15px]";
    const btn = "flex flex-col px-4 py-auto rounded-full border border-emerald-600 shadow-md shadow-blue-200 text-white text-sm"
    return (
        <div className={styles.signupMain}>
            <div>
                <button className={btn} onClick={() => signIn()}>Signin</button>

                <Link href={"/register"}>
                    <button className={btn}>register</button>
                </Link>
            </div>
        </div>
    )
}