import React from 'react';
import styles from "@component/post/post.module.css";



export default function PostHeader() {
    const url = "/images/posts.png"
    return (
        <div className={styles.postHeader}
            style={{ backgroundImage: `url(${url})` }}
        >

        </div>
    )
}
