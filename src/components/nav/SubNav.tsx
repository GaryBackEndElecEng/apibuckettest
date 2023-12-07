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
import { useWindowSize, useChange } from '@/lib/ultils';
import { useRouter } from "next/navigation";

export default function SubNav() {
    const router = useRouter();
    const [show, setShow] = React.useState<boolean>(false);
    const [isOpenAndSmall, setIsOpenAndSmall] = React.useState<boolean>(false);
    const pathname = usePathname();
    let pathHasChanged = useChange(pathname);
    const logo = "/images/gb_logo.png";
    const { setMsg, msg, setPageChange, pageChange } = useGeneralContext();
    const size = useWindowSize();
    const isSmall: boolean = (size && size !== "lg") ? true : false;

    React.useEffect(() => {
        if (pathHasChanged) {
            setPageChange(false);
            setShow(false)
        }
    }, [setPageChange, pathHasChanged]);

    React.useEffect(() => {

        if (pathname) {
            const params: pageHitType = { name: "none", page: pathname, count: 1 }
            const sendPgHit = async () => {
                const controller = new AbortController();
                const res = await fetch("/api/pagehit", {
                    method: "POST",
                    body: JSON.stringify(params),
                    signal: controller.signal
                });
                const body: { message: string } = await res.json()
                if (res.ok) {
                    setMsg({ loaded: true, msg: body.message });
                    setPageChange(true);
                    setShow(false);
                } else if (res.status > 200 && res.status < 500) {
                    setMsg({ loaded: false, msg: body.message })
                } else {
                    setMsg({ loaded: false, msg: "server error" })
                }
                return () => controller.abort()
            }
            sendPgHit();
        }
    }, []);

    const handleShow = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.preventDefault();
        if (!show && size !== "lg") {
            return setShow(true)
        } else {
            return setShow(false);
        }
    }
    const handleMouse = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        if (show) {
            setIsOpenAndSmall(true);
            setShow(false);
            setPageChange(false);
        }

    }

    return (
        <main className={`${styles.navMain}`} onMouseLeave={(e) => handleMouse(e)}>
            <Image src={logo} width={50} height={50} alt="www.ablogroom.com" onClick={(e) => handleShow(e)} priority />
            <MediaLinks />
            <div className={styles.subNav}>

                <div className={show ? styles.navlistShow : styles.navlist}>
                    <React.Fragment>
                        {navList2 && navList2.map((navlink, index) => (
                            <Link href={navlink.link} key={index} style={{ background: "black", color: "white", width: "100%", margin: "0" }} data-desc={navlink.desc}>
                                <IconButton >
                                    {navlink.icon}
                                    <span className={styles.link_name}>
                                        {navlink.name}
                                    </span>
                                    {isSmall && <span className={" text-white  text-sm"}> :<span>{navlink.desc}</span></span>}
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

