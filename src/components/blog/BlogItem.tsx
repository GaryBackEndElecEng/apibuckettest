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


type MainItemType = {
    file: fileType,
    user: userType
}
export default function BlogItem({ file, user }: MainItemType) {
    const [pageHits, setPageHits] = React.useState<pageHitType[] | undefined>(undefined)
    const arrLikeIcon: likeIcon[] | null = file.likes ? calcLikes(file.likes) : null;
    const [getHits, setGetHits] = React.useState<number | null>(null);

    React.useEffect(() => {
        const getPages = async () => {
            const pages = await getPageHits();
            if (!pages) return
            setPageHits(pages);
            if (file.id) {
                const calcs = calcHits(pages, file.id);
                setGetHits(calcs);
            }
        }
        getPages();
    }, [file]);

    return (
        <div className={styles.card}>
            <h2 className="text-style">{file && file.title.toUpperCase()}</h2>
            {file && file.imageUrl && <Image src={file.imageUrl} width={600} height={400} alt="www.ablogroom.com" className="fileImage" />}
            <p>{file.content}</p>
            <div className="flexcol">
                {file.inputs &&
                    file.inputs.map((input, index) => (
                        <React.Fragment key={index}>
                            <InputDisplay input={input} />
                        </React.Fragment>
                    ))
                }
            </div>
            <div className="line-break" />
            <UserCard user={user} />
            <div className="line-break" />
            <div className="flexrow">
                <small>{file.name}</small>
                {file.date && <small>{getFormattedDate(file.date)}</small>}
                {pageHits && getHits && <small>hits:{getHits}</small>}
            </div>
            <div className="flexrow">
                <small>average rating:{file.rates && calcAvg(file.rates)}</small>
                {arrLikeIcon &&
                    <div className="flexrowsm">
                        {arrLikeIcon.map((item, index) => (
                            <div key={index} className="flexcolsm">
                                <small className="text-orange-800">{item.icon}</small>
                                <small>{item.name}</small>
                                <small>{item.count}</small>
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className="line-break" />
        </div>
    )
}
