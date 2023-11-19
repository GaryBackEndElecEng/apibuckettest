"use client";
import styles from "@component/register/register.module.css";
export default function GenMsg({ bool }: { bool: boolean | null }) {
    setTimeout(() => { bool = true }, 4000);
    return (
        <>
            {!bool && bool !== null ?
                <div className={styles.gen_msg}>
                    <h3>password!</h3>
                    <h4> it needs to be a minimum of 4 characters with a special character (!,$,?,,,etc)</h4>
                </div>
                :
                <></>
            }
        </>
    )

}