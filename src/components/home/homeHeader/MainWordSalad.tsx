"use client"
import React from 'react';
import { wordSalad1 } from "./wordSalad";
import styles from "./home2.module.css"
import { FaExclamation } from "react-icons/fa";

export default function MainWordSalad() {
    const refSal = React.useRef(null);
    const [show, setShow] = React.useState<boolean>(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            let entry = entries[0];
            setShow(entry.isIntersecting);
        }, { threshold: 1 });

        if (refSal.current) {
            observer.observe(refSal.current)
        } else {
            return () => observer.disconnect()
        }
    }, []);
    return (
        <div className={show ? styles.wrdSalad : styles.wrdSaladHide} ref={refSal}>
            {wordSalad1.map((word, index) => (
                <React.Fragment key={index}>
                    <p className={styles.spanStart}>{word.name} </p>
                    <p className={styles.spanMiddle} >{word.name1}</p>
                    <p className={styles.spanEnd} >{word.name3}</p>
                    <FaExclamation style={{ color: "red" }} className={styles.spanEnd} />

                </React.Fragment>
            ))}
        </div>
    )
}
