import React from 'react';
import styles from "@component/dashboard/createblog/createablog.module.css";

type mainPopupType = {
    trigger: boolean,
    message: string | undefined
}
export default function Popup({ trigger, message }: mainPopupType) {
    return (
        <div className={styles.mainPopup}>
            {
                message &&
                <div className={styles.pop_up}>
                    {
                        trigger ?
                            <h3>{message}</h3>
                            :
                            <h2>{message}</h2>
                    }
                </div>
            }
        </div>
    )
}
