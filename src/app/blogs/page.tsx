import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import React, { Suspense } from 'react';
import { PrismaClient } from "@prisma/client";
import { fileType, userType } from '@/lib/Types';
import Blog from "@component/blog/Blog";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/blog/blog.module.css";
import PostHeader from "@component/post/PostHeader";
import { notFound } from "next/navigation";



const url = process.env.BUCKET_URL as string
// const url = "https://garyposttestupload.s3.amazonaws.com"
const Bucket = process.env.BUCKET_NAME as string
const region = process.env.BUCKET_REGION as string
const accessKeyId = process.env.SDK_ACCESS_KEY as string
const secretAccessKey = process.env.SDK_ACCESS_SECRET as string
const expiresIn = process.env.EXPIRESIN as string
const s3 = new S3Client({

    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region,
})
const prisma = new PrismaClient();


export default async function Page() {
    const files = await getFiles();
    const users = await getUsers();
    return (

        <div className={styles.blogsIndexContainer}>
            <div className={`${styles.blogGrid}  mx-auto place-items-center bg-slate-300 `}>
                <Suspense fallback="Loading....">
                    {(files && users) ? files.map((file, index) => {
                        if (file.published === true) {
                            const user: userType | undefined = users.find(user => (user.id === file.userId))
                            return (

                                <React.Fragment key={index}>
                                    <Blog file={file} user={user} />
                                </React.Fragment>

                            )
                        }

                    })
                        :
                        notFound()
                    }
                </Suspense>
            </div>
        </div>

    )
}

export async function getFiles() {
    const files = await prisma.file.findMany({ include: { rates: true } });
    const fileInserts = files.map(file => {
        if (file.imageKey) {
            file.imageUrl = `${url}/${file.imageKey}`

        }
        return file
    });
    return fileInserts as fileType[]
}
export async function getUsers() {
    const users = await prisma.user.findMany() as userType[];
    const usersInserts = users.map(user => {
        if (user.imgKey) {
            user.image = `${url}/${user.imgKey}`
        }
        return user
    })
    return usersInserts
}

async function insertImg(file: fileType) {
    if (file.imageKey && file.published === true) {
        const params = {
            Key: file.imageKey,
            Bucket
        }
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
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
        const url = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
        if (url) {
            user.image = url
        }
    }
    return user
}