"use client";
import React from 'react';
import { wordSalad1 } from "./wordSalad"
import styles from "./home2.module.css"
import { FaExclamation } from "react-icons/fa";
import Login from "@component/comp/Login";

export default function HomeHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
    const colorWld = "/images/colorWorld.png"
    const len = wordSalad1.length;
    const lenHalf = Math.floor(len / 2);
    const [tools, setTools] = React.useState<boolean>(false);

    React.useEffect(() => {
        setTimeout(() => { setTools(true) }, 3000);
    }, []);

    return (
        <div className={!isLoggedIn ? styles.mainHeader : styles.hideHeader}>
            <h1 style={{ backgroundImage: `url(${colorWld})` }}> CREATE YOUR BLOG/POST</h1>
            <h3> www.ablogroom.com</h3>
            <div className={styles.mainHeaderGrid}>
                <div className={styles.childGrid}>
                    <div className={styles.wrdSalad}>
                        {wordSalad1.slice(0, lenHalf).map((word, index) => (
                            <React.Fragment key={index}>
                                <p className={styles.spanStart}>{word.name} </p>
                                <p className={styles.spanMiddle} >{word.name1}</p>
                                <p className={styles.spanEnd} >{word.name3}</p>
                                <FaExclamation style={{ color: "red" }} className={styles.spanEnd} />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className={styles.childGrid}>
                    <div className={styles.wrdSalad}>
                        {wordSalad1.slice(lenHalf, len - 1).map((word, index) => (
                            <React.Fragment key={index}>
                                <p className={styles.spanStart}>{word.name} </p>
                                <p className={styles.spanMiddle} >{word.name1}</p>
                                <p className={styles.spanEnd} >{word.name3}</p>
                                <FaExclamation style={{ color: "red" }} className={styles.spanEnd} />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <p className={tools ? styles.showTools : styles.hideTools}> We give you the tools to advertise your talent</p>
            <div className={styles.login}>

                <Login />
            </div>
            <h1 style={{ backgroundImage: `url(${colorWld})` }}> BLOGGERS</h1>
        </div>
    )
}
