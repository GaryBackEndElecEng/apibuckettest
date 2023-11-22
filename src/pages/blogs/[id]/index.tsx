import type { GetServerSideProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { fileType, userType, GetServerSidePropsResult } from '@/lib/Types';
import Blog from "@component/blog/Blog";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/blog/blog.module.css";
import PostHeader from "@component/post/PostHeader";
import BlogItem from "@component/blog/BlogItem";
import "../../globalsTwo.css"



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

type Repo = {
    fileInsert: fileType,
    userInsert: userType
}


async function insertFileImg(file: fileType): Promise<fileType> {
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
    const inputs = await Promise.all(
        file.inputs.map(async (input) => {
            if (input.s3Key) {
                const params = { Key: input.s3Key, Bucket };
                const command = new GetObjectCommand(params);
                input.url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            }
            return input
        })
    );

    return { ...file, inputs: inputs }
}
async function insertUserImg(user: userType): Promise<userType> {
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
    const params = context.params;
    const id = params ? params.id as string : undefined
    // if (id) {
    const file = await prisma.file.findUnique({
        where: {
            id: id
        },
        include: { inputs: true, likes: true, rates: true }
    });

    const fileInsert = await insertFileImg(file as fileType);
    const user = await prisma.user.findUnique({
        where: {
            id: file?.userId
        }
    });
    const userInsert = await insertUserImg(user as userType);
    const repo = { fileInsert, userInsert }
    return { props: { repo } }

}) satisfies GetServerSideProps<{ repo: Repo }>

export default function Page({
    repo
}: InferGetStaticPropsType<typeof getServerSideProps>) {

    return (
        <React.Fragment>
            <PostHeader />
            <div className="container flexcol">
                {repo.fileInsert && repo.userInsert &&

                    <div className={styles.mainBlogItem}>
                        <BlogItem file={repo.fileInsert} user={repo.userInsert} />
                    </div>
                }
            </div>
        </React.Fragment>
    )
}
