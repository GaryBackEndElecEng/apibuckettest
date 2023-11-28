"use client"
import React from 'react'
import type { msgType } from "@lib/Types";
import styles from "@component/comp/comp.module.css";
import { usePostContext } from '@context/PostContextProvider';

export default function PostMsg() {
    const { postMsg, setPostMsg } = usePostContext();
    setTimeout(() => {
        setPostMsg(undefined)
    }, 4000);
    return (
        <React.Fragment>
            {postMsg && postMsg.msg &&
                <div className={styles.message}>
                    {postMsg.loaded ?
                        <div className={styles.messagePasssed}>
                            <h3>{postMsg.msg}</h3>
                        </div>
                        :
                        <div className={styles.messageNotPasssed}>
                            <h3>{postMsg.msg}</h3>
                        </div>
                    }
                </div>
            }
        </React.Fragment>
    )
}