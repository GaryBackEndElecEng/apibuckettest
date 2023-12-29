"use client";
import React from 'react'
import Image from "next/image";
import styles from "./home2.module.css";

export default function LogoImage({ logo }: { logo: string }) {
    const [show, setShow] = React.useState<boolean>(false);
    const logoRef = React.useRef(null);
    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            let entry = entries[0];
            setShow(entry.isIntersecting);
        }, { threshold: 1 });
        if (logoRef.current && logo) {
            observer.observe(logoRef.current);
        }
    }, [logo]);
    return (
        <Image
            ref={logoRef}
            src={logo}
            alt="www.ablogroom.com"
            width={125}
            height={125}
            priority
            style={{ width: "auto" }}
            blurDataURL={logo}
            placeholder={"blur"}
            className={show ? styles.logoImage : styles.logoHide}
        />
    )
}
