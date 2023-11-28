"use client";
import React from 'react';
import { calcAvg, calcLikes, calcfileHits } from '@/lib/ultils';
import { fileLikeType, fileRateType, fileType, likeIcon } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import axios from "axios";
import GenStars from "@component/comp/GenStars";
import { useGeneralContext } from '@context/GeneralContextProvider';
import BlogRate from "@component/blog/BlogRate";
import BlogLike from "@component/blog/BlogLike";
import styles from "./blog.module.css";

export default function BlogRatesLikes({ file }: { file: fileType }) {
    const [likeIcons, setlikeIcons] = React.useState<likeIcon[]>([]);
    const { pageHits } = useGeneralContext();


    return (
        <div className={styles.likeRateCard}>
            <h3 className="text-bold underline underline-offset-8 text-center text-2xl">Info</h3>

            <div className="flexcol w-full">
                <div>{
                    likeIcons && likeIcons.map((ico, index) => (
                        <div className="flexcolsm" key={index}>
                            <small>name:{ico.name}</small>
                            <small>hits:{ico.count}</small>
                            {ico.icon}
                        </div>
                    ))
                }</div>

            </div>
            <div className={styles.gridRateLike}>
                <div>
                    <h3 className="text-slate-600 text-center font-bold mb-1">Rate Me <span className="text-red-800 mx-1">!</span></h3>
                    <BlogRate file={file} />
                </div>
                <div>
                    <h3 className="text-slate-600 text-center font-bold mb-1">Like Me <span className="text-red-800 mx-1">!</span></h3>
                    <BlogLike file={file} />
                </div>
            </div>
        </div>
    )
}