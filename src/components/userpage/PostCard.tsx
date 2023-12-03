"use client"
import { postType } from '@/lib/Types'
import React from 'react'
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./userpage.module.css";
import Image from 'next/image';
import getFormattedDate from '../../lib/getFormattedDate';
import GenStars from "@component/comp/GenStars";
import { calcAvg } from "@lib/ultils"

export default function PostCard({ post }: { post: postType }) {
    const router = useRouter();
    const handleRoute = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        router.push(`/posts/${post.id}`)
    }

    return (
        <div className={`${styles.mainPostcard} cursor-pointer`} onClick={handleRoute}>
            <div >
                <h2 style={{ color: "white" }}>{post.name}</h2>
                {post && post.imageUrl && <Image src={post.imageUrl} alt={post.name} width={375} height={375} />}
            </div>
            <p>{post.content.slice(0, 75)}...</p>
            <div className="flexrow">
                <span>{post.date && getFormattedDate(post.date)}</span>
                <span></span>
            </div>
            {post.rates && <GenStars rate={calcAvg(post.rates)} />}

        </div>
    )
}
