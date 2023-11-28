"use client";
import React from 'react';
import styles from "@component/post/post.module.css";
import { postType, postRateType, msgType } from '@/lib/Types';
import GenStars from "@component/comp/GenStars";
import { usePostContext } from '../context/PostContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { calcAvg } from "@lib/ultils";
import GenericMsg from "@component/comp/GenericMsg";

//make line of switches for likes and dislikes, then add it to posts=> DO THE SAME FOR POSTS
type rateFetchType = {
    rate: postRateType,
    message: string
}
type mainPostLikeType = {
    post: postType,

}
export default function PostRate({ post }: mainPostLikeType) {
    const rateNumArr: number[] = [0, 1, 2, 3, 4, 5]
    const [postRates, setPostRates] = React.useState<postRateType[]>([]);
    const [postMsg, setPostMsg] = React.useState<msgType | undefined>()
    const [rate, setRate] = React.useState<number>(0);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const tempRate: postRateType = { rate: rate, postId: post.id as number }
        try {
            const res = await fetch("/api/postrate", {
                method: "POST",
                body: JSON.stringify(tempRate)
            })
            if (res.ok) {
                const body: rateFetchType = await res.json();
                setPostRates([...post.rates, body.rate]);
                setPostMsg({ loaded: true, msg: body.message })
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@like`)
        }

    }
    return (
        <div className={styles.mainPostRate}>
            <GenericMsg postMsg={postMsg} setPostMsg={setPostMsg} />

            <div >
                <h3 className="text-center underline underline-offset-7 text-bold mb-1"> Rate Me!</h3>
                <div>
                    <h3>Average rating</h3>
                    <GenStars rate={calcAvg(post.rates)} />
                </div>
                <form className={styles.PostRateForm}
                    onSubmit={handleSubmit}>
                    <select
                        className="p-1 border border-emerald-500 rounded-lg bg-slate-600 text-white"
                        name={"rate"}
                        value={String(rate)}
                        onChange={(e) => setRate(parseInt(e.target.value))}
                    >
                        {rateNumArr.map((num: number) => (
                            <React.Fragment key={num + 1}>
                                <option value={num}>{num}</option>
                            </React.Fragment>
                        ))}
                    </select>
                    <button className={styles.buttonsm} type="submit">rate Me</button>
                </form>
                <GenStars rate={rate} />
            </div>

        </div>
    )
}