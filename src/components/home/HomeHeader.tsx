"use client";
import React from 'react'
import { introArr } from "@component/home/homeExtra";
import styles from "./home.module.css";
import { usePathname } from "next/navigation";

type lineType = {
    id: number,
    phr: string | undefined,
    phr1: string | undefined,
    phr2: string | undefined,
    phr3: string | undefined,
    phr4: string | undefined,
    phr5: string | undefined
}

export default function HomeHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
    const pathname = usePathname();
    const url = "/images/logo_1500.png";
    const [show, setShow] = React.useState<boolean>(false);
    const [show1, setShow1] = React.useState<boolean>(false);
    const [count, setCount] = React.useState<number>(0);
    const [line, setLine] = React.useState<lineType>({ id: 0, phr: "", phr1: "", phr2: "", phr3: "", phr4: "", phr5: "" });

    React.useEffect(() => {

        if (!isLoggedIn) {
            if (count > 4) {
                setShow1(true);
                setShow(false);
            } else { setShow(true) }
            if (count === 0 || count < 6) {
                setTimeout(() => {
                    setCount(prev => prev + 1)
                }, 10000);
                setLine(introArr[count] as lineType)
            }
        } else {
            setShow1(true);
        }
    }, [count, isLoggedIn]);

    return (
        <div className={styles.homeHeader}
            style={{ backgroundImage: `url(${url})` }}
        >
            {!isLoggedIn &&
                <div className={show ? styles.homeGrid : styles.remove}>
                    <p></p>
                    <p className={styles.gridElementOn}>
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
                </div>
            }
            <div className={show1 ? styles.finalMsg : styles.remove}>
                <p></p>
                <div className={styles.p_grid}>
                    <p> Helping you helps us,,,</p>
                    <h3> ablogroom.com</h3>
                </div>
            </div>

        </div>
    )
}
