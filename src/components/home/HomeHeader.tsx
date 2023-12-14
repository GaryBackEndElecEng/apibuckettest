"use client";
import React from 'react'
import { introArr } from "@component/home/homeExtra";
import styles from "./home.module.css";
import { usePathname } from "next/navigation";
import { useOnScroll } from "@lib/ultils";
import GridOneTwo from "./GridOneTwo";
import RequestInfo from "./RequestInfo";

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
    const isScroll = useOnScroll();
    const pathname = usePathname();
    const url = "/images/bgWave.png";
    const picGridOne = "/images/gridOneTwo1.png"
    const [show, setShow] = React.useState<boolean>(false);
    const [show1, setShow1] = React.useState<boolean>(false);
    const [turnOn, setTurnOn] = React.useState<boolean>(false);

    const handleTurnOn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (!turnOn) {
            setTurnOn(true);
            setShow1(false);
        } else {
            setTurnOn(false);
            setShow1(true);
        }
    }


    return (
        <div className={!isLoggedIn ? styles.homeHeader : styles.remove}
            style={{ backgroundImage: `url(${url})` }}
        >


            <div className={styles.homeGrid}>
                <div className={styles.gridOneTwo}>
                    <GridOneTwo />
                </div>

                <div className={styles.gridThree}>

                    <RequestInfo
                        setShow={setShow}
                        show={show}
                        isScroll={isScroll}
                        setShow1={setShow1}
                        show1={show1}
                        setTurnOn={setTurnOn}
                        turnOn={turnOn}
                    />
                </div>
            </div>


            <div className="flex flex-col mx-auto py-2">
                {!isScroll &&
                    <button className="rounded-full px-3 py-1 bg-slate-700 text-white shadow shadow-slate-200" onClick={(e) => handleTurnOn(e)}>
                        info
                    </button>
                }
            </div>

        </div>
    )
}
