"use client"
import React from 'react'
import type { msgType } from "@lib/Types";
import styles from "@component/comp/comp.module.css";
import { usePostContext } from '@context/PostContextProvider';
type genericType = {
    setPostMsg: React.Dispatch<React.SetStateAction<msgType>>,
    postMsg: msgType
}
export default function GenericMsg({ setPostMsg, postMsg }: genericType) {
    const [turnoff, setTurnoff] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (postMsg && postMsg.msg && postMsg.loaded) {
            setTimeout(() => {
                setPostMsg(undefined)
                setTurnoff(true)
            }, 4000);
        }
    }, [postMsg, setPostMsg]);


    return (
        <React.Fragment>
            {postMsg && postMsg.msg && !turnoff &&
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