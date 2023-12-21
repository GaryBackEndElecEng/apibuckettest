import React from 'react';
import styles from "./contact.module.css";

export default function ContactHeader() {
    const happy = "/images/happyFamily.png";
    return (
        <div
            style={{ backgroundImage: `url(${happy})` }}
            className={styles.mainHeader}
        >

        </div>
    )
}
