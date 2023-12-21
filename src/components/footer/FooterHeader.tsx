"use client";
import React from 'react';
import styles from "./footer.module.css";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useWindowSize } from "@lib/ultils";


export default function FooterHeader({ logo }: { logo: string }) {
    const roomRef = React.useRef(null);
    const [showMsg, setShowMsg] = React.useState<boolean>(false);
    const size = useWindowSize();

    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            let entry = entries[0];
            setShowMsg(entry.isIntersecting);
        }, { threshold: 0.6 });
        if (roomRef.current) {
            observer.observe(roomRef.current);
        }
    }, [showMsg]);

    return (
        <div className={styles.masterFooterHeader} style={{ backgroundImage: `url(${logo})`, position: "relative" }}>
            <div ref={roomRef} className={styles.footerHeaderGrid} style={{ position: "relative" }}>
                <div className={showMsg ? styles.logoHeaderOne : styles.hideLogoHeaderOne}  >
                    <h3> a room for you</h3>
                    <h5>free of charge</h5>
                </div>
                <div className={styles.logoHeaderTwo}>

                    <div>
                        <h3 data-link="Email Use">
                            {(size !== ("sm" || "xs")) && "mail"}
                            <a href={"mailto:masterultils@gmail.com"} >
                                <MdEmail style={{ color: "green" }} />
                            </a></h3>
                        <h3 data-link="Call Use">
                            {(size !== ("sm" || "xs")) && "phone"}
                            <a href={"tel:4169175768"} >
                                <FaPhoneAlt style={{ color: "blue" }} />
                            </a>
                        </h3>
                    </div>


                </div>
            </div>
        </div>
    )
}
