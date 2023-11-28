"use client";
import { fileType, userType, likeIcon, pageHitType } from '@/lib/Types'
import React from 'react'
import styles from "@component/blog/blog.module.css";
import Image from 'next/image';
import getFormattedDate from "@lib/getFormattedDate";
import { calcAvg, calcLikes, calcHits } from "@lib/ultils";
import InputDisplay from "@component/blog/InputDisplay";
import UserCard from "@component/blog/UserCard";
import { getPageHits } from '@/lib/fetchTypes';
import BlogRatesLikes from "@component/blog/BlogRatesLikes";
import { useGeneralContext } from '@context/GeneralContextProvider';


type MainItemType = {
    file: fileType,
    user: userType
}
export default function BlogItem({ file, user }: MainItemType) {
    const { pageHits } = useGeneralContext();
    const arrLikeIcon: likeIcon[] | null = file.likes ? calcLikes(file.likes) : null;

    return (
        <div className={styles.card}>
            <h2 className={styles.textStyle}>{file && file.title.toUpperCase()}</h2>
            {file && file.imageUrl && <Image src={file.imageUrl} width={600} height={400} alt="www.ablogroom.com" className={styles.fileImage} />}
            <p className="paraCreator">{file.content}</p>
            <div className="flexcol">
                {file.inputs &&
                    file.inputs.map((input, index) => (
                        <React.Fragment key={index}>
                            <InputDisplay input={input} />
                        </React.Fragment>
                    ))
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
