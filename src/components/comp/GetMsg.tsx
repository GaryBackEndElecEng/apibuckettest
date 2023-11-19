"use client"
import React from 'react'
import type { msgType } from "@lib/Types";
import styles from "@component/comp/comp.module.css";
import { useDashboardContext } from '../context/DashBoardContextProvider';

export default function GetMsg() {
    const { msg, setMsg } = useDashboardContext();
    setTimeout(() => {
        setMsg({ loaded: false, msg: "" })
    }, 4000);
    return (
        <React.Fragment>
            {msg.msg &&
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
