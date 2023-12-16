"use client";
import React from 'react';
import styles from "@component/post/post.module.css";
import { postType, postRateType, msgType, fileType, fileRateType } from '@/lib/Types';
import GenStars from "@component/comp/GenStars";
import { usePostContext } from '../context/PostContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { calcAvg } from "@lib/ultils";
import GenericMsg from "@component/comp/GenericMsg";
import toast from 'react-hot-toast';

//make line of switches for likes and dislikes, then add it to posts=> DO THE SAME FOR POSTS
type rateFetchType = {
    rate: fileRateType,
    message: string
}
type mainPostLikeType = {
    file: fileType,

}
export default function PostRate({ file }: mainPostLikeType) {
    const rateNumArr: number[] = [0, 1, 2, 3, 4, 5]
    const [fileRates, setFileRates] = React.useState<fileRateType[]>([]);
    const [blogMsg, setBlogMsg] = React.useState<msgType | undefined>()
    const [rate, setRate] = React.useState<number>(0);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const tempRate: fileRateType = { rate: rate, fileId: file.id as string }
        try {
            const res = await fetch("/api/filerate", {
                method: "POST",
                body: JSON.stringify(tempRate)
            })
            if (res.ok) {
                const body: rateFetchType = await res.json();
                setFileRates([...file.rates, body.rate]);
                toast.success(`thanks for the  ${body.rate.rate}`);
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@like`)
            setBlogMsg({ loaded: false, msg: message })
            toast.error("sorry something went wrong?")
        }

    }
    return (
        <div className={styles.mainPostRate}>
            <GenericMsg postMsg={blogMsg} setPostMsg={setBlogMsg} />
            <div >
                <div>
                    <h3>Average rating</h3>
                    <GenStars rate={calcAvg(file.rates)} />
                </div>
                <form className={styles.rateForm}
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