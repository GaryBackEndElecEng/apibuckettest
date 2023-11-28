"use client";
import { fileType, userType, likeIcon, pageHitType } from '@/lib/Types'
import React from 'react'
import styles from "@component/blog/blog.module.css";
import Image from 'next/image';
import getFormattedDate from "@lib/getFormattedDate";
import { calcAvg, calcLikes, calcHits } from "@lib/ultils";
import InputDisplay from "@component/blog/InputDisplay";
import UserCard from "@component/blog/UserCard";
import "@pages/globalsTwo.css";
import { getPageHits } from '@/lib/fetchTypes';
import BlogRatesLikes from "@component/blog/BlogRatesLikes";
import { useGeneralContext } from '@context/GeneralContextProvider';
import { useBlogContext } from '@/components/context/BlogContextProvider';


type MainItemType = {
    file: fileType,
    getuser: userType
}
export default function BlogDetail({ file, getuser }: MainItemType) {
    const { pageHits, setUser, user } = useGeneralContext();
    const { file_, setFile_ } = useBlogContext();
    const arrLikeIcon: likeIcon[] | null = file.likes ? calcLikes(file.likes) : null;
    React.useEffect(() => {
        setFile_(file);
        setUser(getuser);
    }, [file, getuser, setUser, setFile_]);

    return (
        <div className={styles.detailContainer}>
            <div className={styles.card}>
                <h2 className="text-style">{file_ ? file_.title.toUpperCase() : file.title.toUpperCase()}</h2>
                {file_ && file_.imageUrl && <Image src={file_.imageUrl} width={600} height={400} alt="www.ablogroom.com" className="fileImage" />}
                <p className="paraCreator">{file_ ? file_.content : file.content}</p>
                <div className="flexcol">
                    {file_ && file_.inputs &&
                        file_.inputs.map((input, index) => (
                            <React.Fragment key={index}>
                                <InputDisplay input={input} />
                            </React.Fragment>
                        ))
                    }
                </div>
                <div className="line-break" />
                {user && <UserCard user={user} />}
                <div className="line-break" />


            </div>
        </div>
    )
}