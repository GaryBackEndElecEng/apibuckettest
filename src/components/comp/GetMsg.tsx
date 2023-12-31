"use client"
import React from 'react'
import type { msgType } from "@lib/Types";
import styles from "@component/comp/comp.module.css";
import { useGeneralContext } from '../context/GeneralContextProvider';

export default function GetMsg() {
    const { msg, setMsg } = useGeneralContext();
    setTimeout(() => {
        setMsg(undefined)
    }, 4000);
    return (
        <React.Fragment>
            {msg && msg.msg &&
                <div className={styles.message}>
                    {msg.loaded ?
                        <div className={styles.messagePasssed}>
                            <h3>{msg.msg}</h3>
                        </div>
                        :
                        <div className={styles.messageNotPasssed}>
                            <h3>{msg.msg}</h3>
                        </div>
                    }
                </div>
            }
        </React.Fragment>
    )
}
