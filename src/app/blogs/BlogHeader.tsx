import React from 'react';
import styles from "@component/blog/blog.module.css";

export default function BlogHeader() {
    const url = "/images/blogsMain.png"
    return (
        <>
            <div className={styles.blogHeader}
                style={{ backgroundImage: `url(${url})` }}
            >

            </div>
        </>
    )
}
