import React from 'react'
import styles from "./privacy.module.css";
import { arr } from "./arrayPolicy";

export default function page() {
    return (
        <div className={styles.main} >
            <h1>PRIVACY POLICY</h1>
            {arr.map((para, index) => (
                <p key={index}>
                    {para.name}
                </p>
            ))}
        </div>
    )
}
