import React from 'react'
import Register from "@/components/register/Register";
import type { Metadata } from 'next';
import styles from "@component/register/register.module.css";
// import { metaRegister } from "@meta/Blog";

// export const metadata: Metadata = metaRegister;


const Page = () => {
    return (

        <div className={styles.mainRegister}>
            <Register />
        </div>

    )
}

export default Page