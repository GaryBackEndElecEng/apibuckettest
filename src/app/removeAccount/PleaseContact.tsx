"use client"
import React from 'react';
import { useRouter } from "next/navigation";
import styles from "./remove.module.css";

export default function PleaseContact() {
    const router = useRouter();

    const handleContact = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        router.push("/contactUs")
    }
    return (
        <div onClick={(e) => handleContact(e)}
            className={styles.contactUs}
        >
            <h2>
                click here to contact Us
            </h2>
            <p> We could not find your information?</p>
            <p> We will remove your account, once contacted</p>
            <small> Sorry for the inconvenience <span style={{ color: "black" }}> - The team</span></small>

        </div>
    )
}
