"use client";
import React from 'react';
import { calcAvg, calcLikes, calcPostHits } from '@/lib/ultils';
import "@pages/globalsTwo.css"
import { likeType, pageHitType, rateType, likeIcon } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import axios from "axios";
import GenStars from "@component/comp/GenStars";

export default function PostRatesLikes({ rates, likes, postId }: { likes: likeType[], rates: rateType[], postId: number | undefined }) {
    const [pageHits, setPageHits] = React.useState<pageHitType[]>([]);
    const [likeIcons, setlikeIcons] = React.useState<likeIcon[]>([]);

    React.useEffect(() => {
        if (postId) {
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
    }, [postId]);
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
                {postId && pageHits && <small>hits:{calcPostHits(pageHits, postId)}</small>}
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
