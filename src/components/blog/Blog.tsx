import React from 'react';
import type { fileType } from '@lib/Types';
import getFormattedDate from "@lib/getFormattedDate";
import UserProfile from "@component/post/UserProfile";
import Image from 'next/image';
import styles from "@component/blog/blog.module.css";


export default function Blog({ file }: { file: fileType }) {
    return (
        <div className={`mx-auto ${styles.card}`}>
            <h3 className="text-center text-2xl mb-3">{file.title.toUpperCase()}</h3>
            {file.imageUrl &&
                <Image src={file.imageUrl} width={350} height={200} alt="www.ablogroom.com" />
            }
            <p className="my-2 leading-8 w-1/2">
                {file.content}
            </p>
            <UserProfile userId={file.userId} />
            <div className="flex flex-row mx-auto gap-2">
                <small className="mx-auto p-1">{file.name}</small>
                {file && file.date && <small className="mx-auto p-1">{getFormattedDate(file.date)}</small>}
            </div>
        </div>
    )
}
