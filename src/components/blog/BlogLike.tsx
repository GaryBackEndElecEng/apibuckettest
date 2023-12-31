"use client";
import React from 'react';
import styles from "@component/post/post.module.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';

import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { postLikeType, postType, postRateType, likeType, likeIcon, likeArr, msgType, fileType, fileLikeType } from '@/lib/Types';
import { usePostContext } from '../context/PostContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import GenericMsg from '../comp/GenericMsg';
import { useLikes } from "@lib/ultils";
import toast from 'react-hot-toast';



type mainIconType = {
    id: number,
    name: string,
    icon: React.ReactNode,
    class: string

}
type mainPostLikeType = {
    file: fileType,



}
type likeFetchType = {
    like: fileLikeType,
    message: string
}
export default function PostLike({ file }: mainPostLikeType) {
    const [blogMsg, setBlogMsg] = React.useState<msgType | undefined>();
    const [Named, setNamed] = React.useState<{ name: string, id: number } | null>(null);
    const [styl, setStyl] = React.useState<string>("noname");
    const [getLikes, setGetLikes] = React.useState<(likeIcon | undefined)[] | null>(null)
    const likes = useLikes(file.likes)

    React.useEffect(() => {
        if (likes) {
            setGetLikes(likes)
        }
    }, [likes])



    const handlePic = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, obj: mainIconType) => {
        e.preventDefault();
        setNamed({ name: obj.name, id: obj.id });
        setStyl(obj.name);
        const tempLike: fileLikeType = { name: obj.name, fileId: file.id as string, count: 1 }

        try {
            const res = await fetch("/api/filelike", {
                method: "POST",
                body: JSON.stringify(tempLike)
            })
            if (res.ok) {
                const body: likeFetchType = await res.json();
                setGetLikes([...likes, body.like as unknown as likeIcon]);
                toast.success(`Thanks for the ${body.like.name}`)
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@like`)
            toast.error("Sorry something went wrong ?")
        }

    }
    return (
        <div className={styles.mainPostLike}>
            {blogMsg && <GenericMsg postMsg={blogMsg} setPostMsg={setBlogMsg} />}
            <div className={styles.subMainPostLike}>
                {
                    iconArr && iconArr.map((obj, index) => {

                        return (
                            <div className="mx-auto" key={index}>

                                <div className="flex flex-row items-center justify-center">
                                    <span onClick={(e) => handlePic(e, obj)} className={
                                        (Named && Named.name === obj.name) ? styles.styl : styles.noname
                                    }>
                                        {obj.icon}
                                    </span>
                                </div>
                                <div className="flex flex-row items-center justify-center">
                                    <span className={(Named && Named.name === obj.name) ? " underline underline-offset-4 text-slate-100 font-bold" : "text-slate-400"}>
                                        {obj.name}
                                    </span>
                                </div>

                            </div>
                        )
                    })
                }
            </div>

            <div className="flexrow">
                {file && file.likes &&
                    getLikes && getLikes.map((obj, index) => {

                        if (obj && obj.name && obj.count) {

                            return (
                                <React.Fragment key={index}>
                                    <div className="flex flex-col items-center justify-center">
                                        <h4> {obj?.name}</h4>
                                        {obj?.icon}
                                        <div>#: {obj?.count}</div>
                                    </div>
                                </React.Fragment>
                            )
                        }
                    })
                }
            </div>

        </div>
    )
}



export const iconArr: mainIconType[] = [
    { id: 1, name: "avg", icon: <ThumbUpIcon />, class: styles.average },
    { id: 2, name: "great", icon: <FavoriteIcon />, class: styles.great },
    { id: 3, name: "loveit", icon: <InsertEmoticonIcon />, class: styles.loveit },
    { id: 4, name: "poor", icon: <ThumbDownIcon />, class: styles.poor },
    { id: 5, name: "amazed", icon: <StarBorderPurple500Icon />, class: styles.amazed },
]