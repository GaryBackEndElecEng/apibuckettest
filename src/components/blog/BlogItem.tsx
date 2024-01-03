"use client";
import { fileType, userType, likeIcon, pageHitType } from '@/lib/Types'
import React from 'react'
import styles from "@component/blog/blog.module.css";
import Image from 'next/image';
import getFormattedDate from "@lib/getFormattedDate";
import { calcAvg, calcLikes, calcHits, sortInput, SeparatePara } from "@lib/ultils";
import InputDisplay from "@component/blog/InputDisplay";
import UserCard from "@component/blog/UserCard";
import { getPageHits } from '@/lib/fetchTypes';
import BlogRatesLikes from "@component/blog/BlogRatesLikes";
import { useGeneralContext } from '@context/GeneralContextProvider';
import { useBlogContext } from '../context/BlogContextProvider';


type MainItemType = {
    file: fileType,
    getuser: userType | undefined
}
export default function BlogItem({ file, getuser }: MainItemType) {
    const { pageHits, setUser, user } = useGeneralContext();
    const { setInput_s, input_s } = useBlogContext();
    const arrLikeIcon: likeIcon[] | null = file.likes ? calcLikes(file.likes) : null;

    React.useEffect(() => {
        if (file) {
            const newOrder = sortInput(file.inputs)
            setInput_s(newOrder)
        }
    }, [file, setInput_s]);

    React.useEffect(() => {
        if (getuser) {
            setUser(getuser)
        }
    }, [getuser, setUser]);

    return (
        <div className={styles.card}>
            <h2 className={styles.textStyle}>{file && file.title.toUpperCase()}</h2>
            {file && file.imageUrl && <Image src={file.imageUrl} width={600} height={600} alt="www.ablogroom.com" className={styles.fileImage} />}
            <SeparatePara para={file.content} class_={"pSection"} />
            <div className="flexcol">
                {input_s &&
                    input_s.map((input, index) => {
                        const check: boolean = input.type ? true : false;
                        if (check) {
                            return (
                                <React.Fragment key={index}>
                                    <InputDisplay input={input} />
                                </React.Fragment>
                            )
                        }

                    })
                }
            </div>
            <div className="line-break-sm" />
            <UserCard user={user} />
            <div className="line-break-sm" />
            <div className="flexrow">
                <small>{file.name}</small>
                {file.date && <small>{getFormattedDate(file.date)}</small>}
                {pageHits && <small>hits:{calcHits(pageHits, file.id as string)}</small>}
            </div>
            <div className="line-break-sm" />
            <BlogRatesLikes file={file} />
            <div className="line-break-sm" />

        </div>
    )
}
