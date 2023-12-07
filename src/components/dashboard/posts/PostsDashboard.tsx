"use client";
import React from 'react';
import Link from "next/link";
import styles from "./posts.module.css";
import { likeIcon, nameRateType, postType, userType } from '@/lib/Types';
import { ArrRatePostResult, usePostLikes } from "@lib/ultils";

type mainPostType = {
    user: userType | null,
    posts: postType[]
}

export default function PostsDashboard({ user, posts }: mainPostType) {
    const [nameRate, setNameRate] = React.useState<nameRateType[]>([]);
    const likes = usePostLikes(posts)


    React.useEffect(() => {
        if (posts) {
            const rateArr = ArrRatePostResult(posts);
            setNameRate(rateArr);
        }
    }, [posts]);

    return (
        <div className={styles.postItemMain}>
            <div className={styles.postsDashGrid}>
                <div>
                    <h3>post create</h3>
                    <Link href={"/dashboard/posts/createPost"}>
                        <button className={styles.btnPostItem}>Create a post</button>
                    </Link>
                </div>
                <div className="flex flex-col items-center justify-center px-1">
                    <h3 className="text-center font-bold my-1">rates</h3>
                    <div className=" m-auto flex flex-col items-center justify-start px-1 h-[15vh] overflow-y-scroll shadow shadow-slate-800 rounded-lg w-full">
                        {
                            nameRate && nameRate.map((rate, index) => (
                                <React.Fragment key={index}>
                                    <div className="text-orange-600">Name:{rate.name}</div>
                                    <div className="font-bold">Avg.cnt.:{rate.count}</div>
                                </React.Fragment>
                            ))
                        }

                    </div>
                    <h3 className="text-center font-bold my-1">likes</h3>
                    <div className=" m-auto flex flex-col items-center justify-start px-1 h-[15vh] overflow-y-scroll shadow shadow-slate-800 rounded-lg w-full">
                        {
                            likes && likes.map((like, index) => {
                                if (like.count > 0) {
                                    return (
                                        <div className="mx-auto flex flex-row justify-start items-center gap-1" key={index}>
                                            <div className="text-orange-800">Name:{like.name}</div>
                                            <div className="font-bold">count:{like.count}</div>
                                            <small className="bg-slate-600 text-white p-[5px]">{like.icon}</small>
                                        </div>
                                    )
                                }
                            })
                        }

                    </div>
                </div>
            </div>

        </div>
    )
}
