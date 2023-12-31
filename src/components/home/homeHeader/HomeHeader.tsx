"use client";
import React from 'react';
import { wordSalad1 } from "./wordSalad";
import styles from "./home2.module.css"
import { FaExclamation } from "react-icons/fa";
import GiveTools from "./GiveTools";
import LogoImage from "./LogoImage";
import Login from "@component/comp/Login";
import MainWordSalad from "./MainWordSalad";

export default function HomeHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
    const colorWld = "/images/colorWorld.png";
    const logo = "/images/logo_500.png";
    const len = wordSalad1.length;
    const lenHalf = Math.floor(len / 2);
    const [tools, setTools] = React.useState<boolean>(false);
    const phr = "We give you the tools to advertise your talent!"
    React.useEffect(() => {
        setTimeout(() => { setTools(true) }, 3000);
    }, []);

    return (
        <div className={!isLoggedIn ? styles.mainHeader : styles.hide}>
            <h1 style={{ backgroundImage: `url(${colorWld})` }}> CREATE YOUR BLOG/POST</h1>
            <LogoImage logo={logo} />
            <h2> We welcome all</h2>
            <h3> www.ablogroom.com</h3>
            <div className={styles.mainHeaderGrid}>
                <div className={styles.childGrid}>
                    <MainWordSalad />
                </div>

            </div>
            <GiveTools phr={phr} />
            <div className={styles.Login}>
                <Login />
            </div>
        </div>
    )
}
