import React from 'react';
import styles from "@component/post/post.module.css";


export default function PostHeader() {
    const url = "/images/happyFamily.png"
    return (
        <div className="mx-0 h-[20vh] w-full"
            style={{ backgroundImage: `url(${url})` }}
        >

        </div>
    )
}
