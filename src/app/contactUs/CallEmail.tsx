import React from 'react';
import styles from "./contact.module.css";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function CallEmail() {
    return (
        <div className={styles.callEmail}
        >
            <div data-set={"call Us"}>
                <a href={"tel:4169175768"}>
                    <FaPhone className={styles.icon} />
                </a>
            </div>
            <div data-set={"email Us"}
            >
                <a href={"mailto:masterultils@gmail.com"}>
                    <MdEmail className={styles.icon} />
                </a>
            </div>


        </div>
    )
}
