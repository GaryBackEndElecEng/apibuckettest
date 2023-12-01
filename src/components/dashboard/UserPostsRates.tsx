import { fileType, rateType, nameRateType, fileRateType, postType } from '@/lib/Types'
import React from 'react';
import styles from "./dashboard.module.css";
import GenStars from "@component/comp/GenStars";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { ArrRatePostResult } from '@/lib/ultils';

export default function UserPostsRates({ posts }: { posts: postType[] }) {

    return (

        <ShowPostRates posts={posts} />

    )
}

export function ShowPostRates({ posts }: { posts: postType[] }) {
    let arr: nameRateType[] = [];

    const ArrRateRes = React.useCallback((): nameRateType[] => {
        return ArrRatePostResult(posts)
    }, []);


    return (
        <div className={`${styles.showRatesMain} bg-slate-300`}>

            {ArrRateRes() && ArrRateRes().map((rate, index) => (
                <div key={index} className="flex justify-center items-center">
                    <div>{rate.name}</div>
                    <span><span className="text-red-800 mx-1">Av:</span>{rate.avRate}</span>
                    <span><span className="text-red-800 mx-1">#:</span>{rate.count}</span>
                </div>
            ))}
        </div>
    )
}