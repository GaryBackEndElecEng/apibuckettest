import React from 'react';
import styles from "./dashboard.module.css";
import { postHits } from "@lib/ultils";
import type { pageHitType, postType, fileType } from "@lib/Types";
import { useGeneralContext } from '../context/GeneralContextProvider';

export default function PostHits({ posts }: { posts: postType[] }) {
    const { pageHits } = useGeneralContext();
    const [pageHitsReduce, setPageHitsReduce] = React.useState<pageHitType[] | null>(null);

    React.useEffect(() => {
        const hitArr = postHits(pageHits, posts);
        if (hitArr) {
            setPageHitsReduce(hitArr)
        }
    }, [posts, pageHits]);

    return (
        <div className={styles.showRatesMain}>
            {
                pageHitsReduce && pageHitsReduce.map((pageHit, index) => (
                    <div key={index} className="flex items-center justify-stretch gap-[0.5rem]">
                        <div><span className="text-red-600">fle: </span>{pageHit.name}</div>
                        <div><span className="text-red-600">#: </span>{pageHit.count}</div>
                    </div>
                ))
            }

        </div>
    )
}