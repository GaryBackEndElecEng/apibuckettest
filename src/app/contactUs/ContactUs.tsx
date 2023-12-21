"use client"
import React from 'react';
import GenContact from "./GenContact";
import styles from "./contact.module.css";
import ContactHeader from "./ContactHeader";
import CallEmail from './CallEmail';

export default function ContactUs({ deletedAcc }: { deletedAcc: boolean }) {
    return (
        <div className={styles.contactus}>
            {deletedAcc &&
                <React.Fragment>
                    <p> Sorry for not satisfying your needs. We are really trying to improve. Please, if you mind, tell us why you deleted your account.</p>
                    <p> We Thank you in advance and have a great day!</p>
                </React.Fragment>
            }
            <ContactHeader />
            <CallEmail />
            <GenContact />
        </div>
    )
}
