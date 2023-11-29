// "use client"
import React from 'react';
import type { fileType, userType } from '@lib/Types';
import getFormattedDate from "@lib/getFormattedDate";
import UserCardTwo from "@component/blog/UserCardTwo";
import Image from 'next/image';
import styles from "@component/blog/blog.module.css";
import Link from "next/link";
import "@pages/globalsTwo.css";




export default function Blog({ file, user }: { file: fileType, user: userType | undefined }) {
    const logo = "/images/gb_logo.png";
    return (
        <div className={styles.blogCard}>
            <Link href={`/blogs/${file.id}`} className="blogsLink flexcol">
                <h3 className="text-center text-2xl mb-3">{file.title.toUpperCase()}</h3>
                {file.imageUrl ?
                    <Image src={file.imageUrl} width={350} height={200} alt="www.ablogroom.com" priority />
                    :
                    <Image src={logo} width={350} height={200} alt="www.ablogroom.com" priority />
                }
                <p className="TWO paraCreator">
                    {file.content.slice(0, 36)}...
                </p>
                <UserCardTwo user={user} />
                <div className="flex flex-row mx-auto gap-2">
                    <small className="mx-auto p-1">{file.name}</small>
                    {file && file.date && <small className="mx-auto p-1">{getFormattedDate(file.date)}</small>}
                </div>
            </Link>
        </div>
    )
}
