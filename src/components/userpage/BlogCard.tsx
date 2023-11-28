import { fileType } from '@/lib/Types'
import React from 'react'
import styles from "./userpage.module.css";
import Image from 'next/image';
import getFormattedDate from '@/lib/getFormattedDate';
import { calcAvg } from '@/lib/ultils';
import GenStars from '../comp/GenStars';


export default function BlogCard({ file }: { file: fileType }) {
    return (
        <div className={styles.mainPostcard}>
            <div >
                <h2 style={{ color: "white" }}>{file.title}</h2>
                {file && file.imageUrl && <Image src={file.imageUrl} alt={file.name} width={375} height={375} />}
            </div>
            <p>{file.content.slice(0, 75)}...</p>
            <div className="flexrow">
                <span>{file.date && getFormattedDate(file.date)}</span>
                <span></span>
            </div>
            {file.rates && <GenStars rate={calcAvg(file.rates)} />}
        </div>
    )
}
