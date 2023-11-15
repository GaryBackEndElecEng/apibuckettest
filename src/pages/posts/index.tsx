import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { postType } from '@/lib/Types';
import Post from "@component/post/Post";
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

async function insertImg(post: postType) {
    if (post.s3Key) {
        const params = {
            Key: post.s3Key,
            Bucket
        }
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        if (url) {
            post.imageUrl = url
        }
    }
    return post
}

export const getServerSideProps = (async (context) => {
    const posts = await prisma.post.findMany() as postType[];
    const postInserts = await Promise.all(
        posts.map(async (post) => await insertImg(post))
    );

    return { props: { postInserts } }
}) satisfies GetServerSideProps<{
    postInserts: postType[]
}>

export default function Page({
    postInserts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <div className={`${styles.grid} lg:container mx-auto place-items-center bg-slate-300`}>
            {postInserts && postInserts.map((post, index) => (
                <React.Fragment key={index}>
                    <Post post={post} />
                </React.Fragment>
            ))}
        </div>
    )
}