"use client";
import React from 'react';
import { calcAvg, calcLikes, calcfileHits } from '@/lib/ultils';
import "@pages/globalsTwo.css"
import { likeType, pageHitType, rateType, likeIcon } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import axios from "axios";
import GenStars from "@component/comp/GenStars";

export default function BlogRatesLikes({ rates, likes, fileId }: { likes: likeType[], rates: rateType[], fileId: string | undefined }) {
    const [pageHits, setPageHits] = React.useState<pageHitType[]>([]);
    const [likeIcons, setlikeIcons] = React.useState<likeIcon[]>([]);

    React.useEffect(() => {
        if (fileId) {
            const getPageHits = async () => {
                try {
                    const { data } = await axios.get("/api/pagehit");
                    const body: pageHitType[] = data;
                    setPageHits(body);
                } catch (error) {
                    console.log(`${getErrorMessage(error)}@pagehit`);
                }
            }
            getPageHits();
        }
    }, [fileId]);
    React.useEffect(() => {
        if (likes) {
            const getIcos = calcLikes(likes);
            setlikeIcons(getIcos)
        }
    }, [likes]);

    return (
        <div className="likeRateCard">
            <h3>Info</h3>
            <div className="flexrow">
                {rates && <small>average rate:{calcAvg(rates)}</small>}
                {fileId && pageHits && <small>hits:{calcfileHits(pageHits, fileId)}</small>}
            </div>
            <GenStars rate={calcAvg(rates)} />
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

            </div>
        </div>
    )
}