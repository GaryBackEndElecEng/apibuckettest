"use client"
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Component() {
    const { data: session } = useSession()
    const main = "flex flex-col sm:flex-row justify-end items-center gap-3";
    const subMain = "flex flex-col justify-center items-center ";
    const button = "px-3 py-0 rounded-full shadow shadow-orange-400 mx-auto text-xs"
    const siginStyle = " text-white text-center text-xs my-0 py-0"
    if (session && session.user && session.user.name) {
        return (
            <div className={main}>
                <div className={subMain}>
                    <small className={siginStyle}>
                        mb:{(session.user?.name.split(" ")[0] as string)}
                    </small>
                    <small className="text-center font-bold my-0 py-0">
                        <Link href={"/blog/dashboard"} >
                            <button className={button}>dashboard</button>
                        </Link>
                    </small>
                </div>
                <button className="flex flex-col px-4 py-autu rounded-full border border-black shadow-md shadow-white text-white text-xs" onClick={() => signOut()}>
                    Sign out
                </button>

            </div>
        )
    }

    const textStyle = " text-white text-center mb-3 underline underline-offset-[15px]";
    const btn = "flex flex-col px-4 py-auto rounded-full border border-emerald-600 shadow-md shadow-blue-200 text-white text-sm"
    return (
        <div className={main}>

            <button className={btn} onClick={() => signIn()}>Signin</button>

            <Link href={"/register"}>
                <button className={btn}>register</button>
            </Link>
        </div>
    )
}