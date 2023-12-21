"use client";
import { userType } from '@/lib/Types';
import React from 'react';
import styles from "./remove.module.css";
import ContactResponse from "@component/dashboard/ContactResponses";
import toast from 'react-hot-toast';

type deleteType = {
    user: userType,
    isDeleted: boolean
}
export default function Thankyou({ user, isDeleted }: deleteType) {
    React.useEffect(() => {
        if (isDeleted) {
            toast.success(`${user.name} your account has been deleted`)
        }
    }, [isDeleted, user]);

    return (
        <div className={styles.thankYou}>
            <p> Thank you for using this app. We are trying to improve your experience on an ongoing basis and appreciate feedback.</p>
            <ContactResponse user={user} />
        </div>
    )
}
