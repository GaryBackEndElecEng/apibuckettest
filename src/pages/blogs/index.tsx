import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { fileType, userType } from '@/lib/Types';
import Blog from "@component/blog/Blog";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/blog/blog.module.css";
import PostHeader from "@component/post/PostHeader";
import "../globalsTwo.css"



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
    const files = await prisma.file.findMany() as fileType[];
    const fileInserts = await Promise.all(
        files.map(async (post) => await insertImg(post))
    );
    const users = await prisma.user.findMany() as userType[];
    const usersInserts = await Promise.all(
        users.map(async (user) => await insertUserImg(user))
    );

    return { props: { fileInserts, usersInserts } }
}) satisfies GetServerSideProps<{
    fileInserts: fileType[],
    usersInserts: userType[]
}>

export default function Page({
    fileInserts, usersInserts
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <React.Fragment>
            <PostHeader />
            <div className={`${styles.grid} lg:container mx-auto place-items-center bg-slate-300`}>
                {fileInserts && usersInserts && fileInserts.map((file, index) => {
                    const user: userType | undefined = usersInserts.find(user => (user.id === file.userId))
                    return (
                        <div key={index}>
                            <Blog file={file} user={user} />
                        </div>
                    )

                })}
            </div>
        </React.Fragment>
    )
}