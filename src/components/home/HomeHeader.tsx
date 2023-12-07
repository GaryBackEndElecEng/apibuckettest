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

export default function HomeHeader() {
    const pathname = usePathname();
    const url = "/images/logo_1500.png";
    const [show, setShow] = React.useState<boolean>(false);
    const [show1, setShow1] = React.useState<boolean>(false);
    const [count, setCount] = React.useState<number>(0);
    const [line, setLine] = React.useState<lineType>({ id: 0, phr: "", phr1: "", phr2: "", phr3: "", phr4: "", phr5: "" });

    React.useEffect(() => {
        console.log(count)
        if (count > 4) {

            setShow(false);
        } else { setShow(true) }
        if (count === 0 || count < 6) {
            setTimeout(() => {
                setCount(prev => prev + 1)
            }, 10000);
            setLine(introArr[count] as lineType)
        }
    }, [count]);

    return (
        <div className={styles.homeHeader}
            style={{ backgroundImage: `url(${url})` }}
        >
            <div className={show ? styles.homeGrid : styles.remove}>
                <p></p>
                <p className={styles.gridElementOn}>
                    {

                        line && Object.entries(line).map((phr, index) => {
                            if (typeof (phr[1]) !== "number") {
                                return (
                                    <React.Fragment key={index}>
                                        <span className={styles.showMsg}>{phr[1]}</span>
                                    </React.Fragment>
                                )
                            }
                        })
                    }
                </p>
            </div>

        </div>
    )
}
