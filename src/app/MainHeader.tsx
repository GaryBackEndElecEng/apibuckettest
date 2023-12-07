"use client"
import React from 'react';
import styles from "@component/post/post.module.css";
import { usePathname } from "next/navigation";
import Nav from "@component/nav/Nav";
import { useHits } from "@lib/ultils";



export default function MainHeader() {

    const pathname = usePathname();
    const check = pathname && pathname === "/" ? true : false;
    const checkTrue = "mainHeaderTrue";
    const checkFalse = "mainHeaderFalse";
    return (
        <>

            <div className={check ? checkTrue : checkFalse}
            >
                <Nav />

            </div>

        </>
    )
}