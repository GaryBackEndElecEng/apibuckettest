"use client";
import React from 'react';
import styles from "./userpage.module.css"
import { userType } from '@/lib/Types';
import Image from 'next/image';
import { useWindowSize } from "@lib/ultils";
import { Ephesis } from 'next/font/google';
const ephesis = Ephesis({ subsets: ['latin'], weight: "400" });
import { useGeneralContext } from '../context/GeneralContextProvider';


export default function UserHeader() {
    const [Name, setName] = React.useState<string | null>(null);
    const { user } = useGeneralContext();

    const url = "/images/gb_logo.png";
    const bgWave = "/images/bgWave.png";
    const windowSize = useWindowSize()

    React.useEffect(() => {
        if (user && user.name) {
            const thisName = firstLast(user.name);
            setName(thisName);
        }
    }, [user]);


    return (
        <div className={styles.mainUserHeader} style={{ backgroundImage: `url(${bgWave})` }}>
            {user &&
                <div className="w-full grid grid-cols-1 md:grid-cols-3 place-items-center my-2 mx-0">
                    <div className="col-span-1 flex flex-col ">

                        <h3 className={`${ephesis.className} text-3xl`}>{Name?.split(" ")[0]} {Name?.split(" ")[1]}</h3>


                        {user.image ?
                            <Image src={user.image} alt={user.name ? user.name : "www.ablogroom.com"} width={75} height={75}
                                className={`${styles.profileImage}`}
                            />
                            :
                            <Image src={url} alt={"www.ablogroom.com"} width={75} height={75} />
                        }
                    </div>

                    <p className="col-span-1 md:col-span-2 ">{user.bio}</p>


                </div>
            }
            <div className={styles.linebreakHeader} />
        </div>
    )
}
export function firstLast(name: string) {
    let arrLet = name.split("");
    let newN: string = name;
    arrLet.forEach((let_, index) => {
        if (index > 0) {
            if (let_.toUpperCase() === let_) {
                newN = `${arrLet.slice(0, index).join("")} ${arrLet.slice(index, arrLet.length - 1).join("")}`

            }
        }
    });
    return newN

}