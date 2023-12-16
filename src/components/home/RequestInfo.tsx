"use client";
import React from 'react'
import styles from "./home.module.css";
import { introArr } from "@component/home/homeExtra";


type lineType = {
    id: number,
    phr: string | undefined,
    phr1: string | undefined,
    phr2: string | undefined,
    phr3: string | undefined,
    phr4: string | undefined,
    phr5: string | undefined
}
type mainRequestType = {
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    show: boolean,
    setShow1: React.Dispatch<React.SetStateAction<boolean>>,
    show1: boolean,
    isScroll: boolean,
    setTurnOn: React.Dispatch<React.SetStateAction<boolean>>,
    turnOn: boolean,
}

export default function RequestInfo({ isScroll, setShow, show, setShow1, show1, turnOn, setTurnOn }: mainRequestType) {
    const [count, setCount] = React.useState<number>(0);
    const [line, setLine] = React.useState<lineType>({ id: 0, phr: "", phr1: "", phr2: "", phr3: "", phr4: "", phr5: "" });
    React.useEffect(() => {
        if (isScroll) {
            setTurnOn(false);
            setShow1(true);
        }
        if (turnOn) {
            setShow1(false);
            setCount(0);
        }
    }, [setCount, turnOn, setShow1, isScroll, setTurnOn])


    React.useEffect(() => {

        if (turnOn) {
            if (count > 4) {
                setShow1(true);
                setTurnOn(false);
            }
            if (count === 0 || count < 6) {
                setTimeout(() => {
                    setCount(prev => prev + 1)
                }, 9000);
                setLine(introArr[count] as lineType)
            }
        }
    }, [count, setShow1, setTurnOn, turnOn]);

    return (
        <div className={styles.requestInfoMain}>
            <p className={(!turnOn) ? styles.remove : styles.infoPara} >
                {

                    line && Object.entries(line).map((phr, index) => {
                        if (typeof (phr[1]) !== "number") {
                            if (phr[0] === "phr") {
                                return (
                                    <React.Fragment key={index}>
                                        <span className={styles.showMsgPhr}>{phr[1]}</span>
                                    </React.Fragment>
                                )
                            } else {
                                return (
                                    <React.Fragment key={index}>
                                        <span className={styles.showMsg}>{phr[1]}</span>
                                    </React.Fragment>
                                )
                            }
                        }
                    })
                }
            </p>
            {(isScroll || show1 || !turnOn) &&
                <div className={styles.helpYou}>
                    <p> Helping you helps us,,,</p>
                    <h3> ablogroom.com</h3>
                </div>
            }
        </div>
    )
}
