"use client";
import React from 'react';
import Link from "next/link";
import styles from "./posts.module.css";


export default function PostsDashboard() {
    return (
        <div className={styles.postItemMain}>
            <div className={styles.postsDashGrid}>
                <div>
                    <h3>post create</h3>
                    <Link href={"/dashboard/posts/createPost"}>
                        <button className={styles.btnPostItem}>Create a post</button>
                    </Link>
                </div>
                <div>

                </div>
            </div>

        </div>
    )
}
