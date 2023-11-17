"use client"
import React from 'react';
import { usePathname } from "next/navigation";
import type { pageHitType, navLinkType } from '@lib/Types';
import { sendPageHit } from "@lib/fetchTypes";
import styles from "@component/nav/nav.module.css";
import { navList } from "@context/navList";
import Link from 'next/link';
import Image from 'next/image';

export default function SubNav() {
    const [show, setShow] = React.useState<boolean>(false);
    const pathname = usePathname();
    const logo = "/images/gb_logo.png"

    React.useEffect(() => {
        if (!pathname) return
        const params: pageHitType = { name: "none", page: pathname }
        const sendPgHit = async () => {
            await sendPageHit(params);
        }
        sendPgHit();
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
            <Image src={logo} width={50} height={50} alt="www.ablogroom.com" onClick={(e) => handleShow(e)} />
            <div className={styles.subNav}>
                <div className={show ? styles.navlistShow : styles.navlist}>
                    {navList && navList.map((navlink, index) => (
                        <Link href={navlink.link} key={index}>
                            {navlink.name}
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}