"use client";
import React from 'react';
import { calcAvg, calcLikes, calcPostHits } from '@/lib/ultils';
import "@pages/globalsTwo.css"
import { postLikeType, pageHitType, postRateType, likeIcon, postType } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { useGeneralContext } from '@context/GeneralContextProvider';
import PostRate from "@component/post/PostRate";
import PostLike from "@component/post/PostLike";

export default function PostRatesLikes({ post }: { post: postType }) {
    const { pageHits } = useGeneralContext();
    const [likeIcons, setlikeIcons] = React.useState<likeIcon[]>([]);
    const [hits, setHits] = React.useState<pageHitType[]>([]);

    React.useEffect(() => {
        if (post && post.likes) {
            const getIcos = calcLikes(post.likes);
            setlikeIcons(getIcos)
        }
    }, [post]);

    React.useEffect(() => {
        if (pageHits) {
            setHits(pageHits)
        }
    }, [pageHits]);

    return (
        <React.Fragment>

            <h1>Interest</h1>
            <div className="flex flex-row my-2 mx-auto gap-1">
                <span>hits: </span>
                {post && <span>{calcPostHits(hits, String(post.id))}</span>}
            </div>
            {post.likes && <PostLike post={post} />}
            {post.rates && <PostRate post={post} />}
        </React.Fragment>
    )
}
