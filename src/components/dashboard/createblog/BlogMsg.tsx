"use client"
import React from 'react'
import type { msgType } from "@lib/Types";
import styles from "@component/comp/comp.module.css";
import { useBlogContext } from '@context/BlogContextProvider';

export default function PostMsg() {
    const { blogMsg, setBlogMsg } = useBlogContext();
    setTimeout(() => {
        setBlogMsg(undefined)
    }, 6000);
    return (
        <React.Fragment>
            {blogMsg && blogMsg.msg &&
                <div className={styles.message}>
                    {blogMsg.loaded ?
                        <div className={styles.messagePasssed}>
                            <h3>{blogMsg.msg}</h3>
                        </div>
                        :
                        <div className={styles.messageNotPasssed}>
                            <h3>{blogMsg.msg}</h3>
                        </div>
                    }
                </div>
            }
        </React.Fragment>
    )
}