import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { fileType } from '@/lib/Types';
import Blog from "@component/blog/Blog";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from "uuid";
import styles from "@component/post/post.module.css";


const Bucket = process.env.BUCKET_NAME as string
const region = process.env.BUCKET_REGION as string
const accessKeyId = process.env.SDK_ACCESS_KEY as string
const secretAccessKey = process.env.SDK_ACCESS_SECRET as string
const s3 = new S3Client({

    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region,
})
const prisma = new PrismaClient();

async function insertImg(file: fileType) {
    if (file.imageKey) {
        const params = {
            Key: file.imageKey,
            Bucket
        }
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        if (url) {
            file.imageUrl = url
        }
    }
    return file
}

export const getServerSideProps = (async (context) => {
    const files = await prisma.file.findMany() as fileType[];
    const fileInserts = await Promise.all(
        files.map(async (post) => await insertImg(post))
    );

    return { props: { fileInserts } }
}) satisfies GetServerSideProps<{
    fileInserts: fileType[]
}>

export default function Page({
    fileInserts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <div className={`${styles.grid} lg:container mx-auto place-items-center bg-slate-300`}>
            {fileInserts && fileInserts.map((file, index) => (
                <React.Fragment key={index}>
                    <Blog file={file} />
                </React.Fragment>
            ))}
        </div>
    )
}