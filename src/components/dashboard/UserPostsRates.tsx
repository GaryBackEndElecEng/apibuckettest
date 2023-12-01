import { fileType, rateType, nameRateType, fileRateType, postType } from '@/lib/Types'
import React from 'react';
import styles from "./dashboard.module.css";
import GenStars from "@component/comp/GenStars";
import { getErrorMessage } from '@/lib/errorBoundaries';

export default function UserPostsRates({ posts }: { posts: postType[] }) {

    return (

        <ShowPostRates posts={posts} />

    )
}

export function ShowPostRates({ posts }: { posts: postType[] }) {
    let arr: nameRateType[] = [];

    const ArrRateRes = React.useCallback((): nameRateType[] => {
        posts.map((post, index) => {
            const len = post.rates && post.rates.length > 0 ? post.rates.length : 1;
            if (post.rates && post.rates.length > 0) {
                const calcAv = post.rates.reduce((a, b) => (a + b.rate), 0);
                const rateAv = Math.round(calcAv / len)
                arr.push({ name: post.name, avRate: rateAv, count: len });
                return
            }
        })
        return arr
    }, []);


    return (
        <div className={`${styles.showRatesMain} bg-slate-300`}>
            <h3 className="text-lg text-center font-bold my-2 mx-auto">post rates</h3>
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