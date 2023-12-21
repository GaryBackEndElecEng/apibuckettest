import React from 'react'
import styles from "./contact.module.css";
import ContactUs from "./ContactUs";

export default function page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const deletedAcc = Boolean(searchParams.deletedAcc as string);


    return (
        <div className={styles.mainContact}>
            <ContactUs deletedAcc={deletedAcc} />
        </div>
    )
}
