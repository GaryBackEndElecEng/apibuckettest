"use client";
import React from 'react';
import { calcAvg, calcLikes, calcfileHits } from '@/lib/ultils';
import "@pages/globalsTwo.css"
import { fileLikeType, fileRateType, fileType, likeIcon } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import axios from "axios";
import GenStars from "@component/comp/GenStars";
import { useGeneralContext } from '@context/GeneralContextProvider';
import BlogRate from "@component/blog/BlogRate";
import BlogLike from "@component/blog/BlogLike";

export default function BlogRatesLikes({ file }: { file: fileType }) {
    const [likeIcons, setlikeIcons] = React.useState<likeIcon[]>([]);
    const { pageHits } = useGeneralContext();


    return (
        <div className="likeRateCard">
            <h3>Info</h3>
            <div className="flexrow">

                {file && pageHits && <small>hits:{calcfileHits(pageHits, file)}</small>}
            </div>
            <div className="flexrow">
                <div>{
                    likeIcons && likeIcons.map((ico, index) => (
                        <div className="flexcolsm" key={index}>
                            <small>name:{ico.name}</small>
                            <small>hits:{ico.count}</small>
                            {ico.icon}
                        </div>
                    ))
                }</div>
                <BlogRate file={file} />
                <BlogLike file={file} />
            </div>
        </div>
    )
}