"use client";
import React from 'react';
import Image from "next/image";
import styles from "./home.module.css";
import { gridOneTwoArr } from "@component/home/homeExtra";
import Login from "@component/comp/Login";

type gridArrType = { id: number, grid1: string, grid2: string, class: string };

export default function GridOneTwo() {
    const logo = "/images/gridOneTwo1.png";
    const [count, setCount] = React.useState<number>(0);
    const [grid, setGrid] = React.useState<gridArrType>();
    const [close, setClose] = React.useState<boolean>(false);
    const [show, setShow] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (count <= gridOneTwoArr.length - 1) {
            setGrid(gridOneTwoArr[count]);
            setTimeout(() => { setShow(false); }, 3700);
            setTimeout(() => {
                setShow(true);
                setCount(prev => prev + 1);
            }, 4000);
        } else {
            setClose(true);
        }
    }, [count]);

    return (
        <div
            className={styles.insideGridOne}
        >
            {grid && !close ?
                <React.Fragment>
                    <div className={styles.insideGridOneImg}
                    >
                        <Image src={logo} width={300} height={300} alt="www.ablogroom.com"
                        />
                        <h1 className="text-2xl text-center">{grid.grid1}</h1>
                    </div>
                    <div >
                        <p className={show ? grid.class : styles.remove}>{grid.grid2}</p>
                    </div>
                </React.Fragment>
                :
                <div className={styles.gridOneLogin}>
                    <div className="flex flex-row py-1 items-center justify-center">

                        <Image
                            src={logo}
                            width={200}
                            height={200}
                            alt="www.ablogroom.com"

                        />
                        <h1 className="text-white">TRY US</h1>
                    </div>
                    <h3 className="text-white">Its free</h3>
                    <Login />
                </div>
            }
        </div>
    )
}
