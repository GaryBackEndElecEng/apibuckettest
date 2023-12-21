"use client";
import React from 'react'
import { GeneralContext } from '../context/GeneralContextProvider';
import { FaGithub, FaLaptop, } from 'react-icons/fa';
import { ImFacebook2 } from "react-icons/im";
import { FaTools } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import type { generalInfoType } from "@lib/Types";
import styles from "@component/nav/nav.module.css";
import { getErrorMessage } from '@/lib/errorBoundaries';
import axios from 'axios';
import "@pages/globalsTwo.css";

interface mediaType extends generalInfoType {
    icon: React.ReactNode | undefined
}

const arrMedia = [
    { name: "facebook", icon: <ImFacebook2 /> },
    { name: "linkedln", icon: <LinkedInIcon /> },
    { name: "masterconnect", icon: <CgWebsite /> },
    { name: "masterultils", icon: <FaTools /> },
    { name: "github", icon: <FaGithub /> },

]

export default function MediaLinks() {
    const [genInfos, setGenInfos] = React.useState<generalInfoType[]>([]);
    const [genInfoPlus, setGenInfoPlus] = React.useState<(mediaType)[]>([]);

    React.useMemo(async () => {
        try {
            const { data } = await axios.get("/api/geninfo");
            const body: generalInfoType[] = data
            const links = body.filter(info => (info.category === "link"));
            setGenInfos(links);
        } catch (error) {
            console.error(`${getErrorMessage(error)}@geninfo`)
        }
    }, []);

    React.useEffect(() => {
        const convergeInfo = genInfos.map((info, index) => {
            const media = arrMedia.find(med => (med.name === info.name));

            if (media && media.icon) {
                return {
                    ...info, icon: media.icon
                }
            } else {
                return { ...info, icon: undefined }
            }
        });
        setGenInfoPlus(convergeInfo);
    }, [genInfos]);

    const handleLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, link: string) => {
        if (window) {
            window.open(link, "blank")
        }
    }

    return (
        <div className={styles.flexrowxs}>
            {genInfoPlus && genInfoPlus.map((info, index) => (
                <div key={index} className={` relative`}>

                    <div onClick={(e) => handleLink(e, info.url)} className={`${styles.linkText} text-white/90  hover:text-red-300 rounded-full`} data-word={info.name} >
                        {info.icon}
                    </div>
                </div>
            ))

            }
        </div>
    )
}
