"use client"
import React from 'react';
import { usePathname } from "next/navigation";
import type { pageHitType, navLinkType } from '@lib/Types';
import { sendPageHit } from "@lib/fetchTypes";
import styles from "@component/nav/nav.module.css";
import { navList, navList2 } from "@context/navList";
import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import MediaLinks from "@component/nav/MediaLinks";
import { useGeneralContext } from '../context/GeneralContextProvider';
import { signOut } from "next-auth/react";
import DropDownTrigger from "./DropDownTrigger";

export default function SubNav() {
    const [show, setShow] = React.useState<boolean>(false);
    const pathname = usePathname();
    const logo = "/images/gb_logo.png";
    const { setMsg, msg } = useGeneralContext();

    React.useEffect(() => {
        if (pathname) {
            const params: pageHitType = { name: "none", page: pathname }
            const sendPgHit = async () => {
                const res = await fetch("/api/pagehit", {
                    method: "POST",
                    body: JSON.stringify(params)
                });
                if (res.ok) {
                    setMsg({ loaded: true, msg: "recieved" })
                } else {
                    setMsg({ loaded: false, msg: "issue@pagehit" })
                }
            }
            sendPgHit();
        }
    }, []);

    const handleShow = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.preventDefault();
        if (!show) {
            return setShow(true)
        } else {
            return setShow(false);
        }
    }

    return (
        <main className={`${styles.navMain}`}>
            <Image src={logo} width={50} height={50} alt="www.ablogroom.com" onClick={(e) => handleShow(e)} priority />
            <MediaLinks />
            <div className={styles.subNav}>
                <div className={show ? styles.navlistShow : styles.navlist}>
                    <React.Fragment>
                        {navList2 && navList2.map((navlink, index) => (
                            <Link href={navlink.link} key={index}>
                                <IconButton>
                                    {navlink.icon}
                                    <span className={styles.link_name}>
                                        {navlink.name}
                                    </span>
                                </IconButton>
                            </Link>
                        ))}
                        <DropDownTrigger />
                    </React.Fragment>
                </div>
                {/* <button onClick={() => signOut()}>logout</button> */}
            </div>
        </main>
    )
}