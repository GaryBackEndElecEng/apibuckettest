"use client"
import React from 'react';
import Image from "next/image";
import styles from "./comp.module.css";


export default function GBImage() {
    const [isMobile, setIsMobile] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (window && window.innerWidth < 420) {
            setIsMobile(true);
        }

    }
        , []);
    const GB = "/images/gb_logo.png";
    const GBStyle = `${isMobile ? styles.GB_imageMobile : styles.GB_image} border border-orange-800 rounded-full p-1  bg-black  hover:bg-slate-300`;
    const widthHeight = isMobile ? 55 : 75;
    return (
        <div className={GBStyle}>
            <Image
                priority
                src={GB}
                alt={"www.garymasterconnect.com"}
                width={widthHeight}
                height={widthHeight}
            />
        </div>
    )
}