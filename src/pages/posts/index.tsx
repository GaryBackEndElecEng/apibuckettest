import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { postType, userType } from '@/lib/Types';
import Post from "@component/post/Post";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/post/post.module.css";
import PostHeader from "@component/post/PostHeader";
import "../globalsTwo.css";
import Link from "next/link";



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
async function insertUserImg(user: userType) {
    if (user.imgKey) {
        const params = {
            Key: user.imgKey,
            Bucket
        }
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        if (url) {
            user.image = url
        }
    }
    return user
}

export const getServerSideProps = (async (context) => {
    const posts = await prisma.post.findMany() as postType[];
    const postInserts = await Promise.all(
        posts.map(async (post) => await insertImg(post))
    );
    const users = await prisma.user.findMany() as userType[];
    const usersInserts = await Promise.all(
        users.map(async (user) => await insertUserImg(user))
    );

    return { props: { postInserts, usersInserts } }
}) satisfies GetServerSideProps<{
    postInserts: postType[],
    usersInserts: userType[]

}>

export default function Page({
    postInserts, usersInserts
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <React.Fragment>
            <PostHeader />
            <div className={`${styles.grid} lg:container mx-auto place-items-center bg-slate-300`}>
                {postInserts && usersInserts && postInserts.map((post, index) => {
                    const user: userType | undefined = usersInserts.find(user => (user.id === post.userId))
                    return (
                        <div key={index}>
                            <Post post={post} user={user} />
                        </div>
                    )

                })}
            </div>
        </React.Fragment>
    )
}