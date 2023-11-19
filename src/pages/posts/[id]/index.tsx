import type { InferGetServerSidePropsType, GetServerSideProps, GetStaticProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { postType, userType, GetServerSidePropsResult } from '@/lib/Types';
import Blog from "@component/blog/Blog";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/blog/blog.module.css";
import PostHeader from "@component/post/PostHeader";
import PostItem from "@component/post/PostItem";
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
    postInsert: postType,
    userInsert: userType
}


async function insertPostImg(post: postType): Promise<postType> {
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
    const id = params?.id as string
    // if (id) {
    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(id)
        },
        include: { likes: true, rates: true }
    });

    const postInsert = await insertPostImg(post as postType);
    const user = await prisma.user.findUnique({
        where: {
            id: post?.userId
        }
    });
    const userInsert = await insertUserImg(user as userType);
    const repo = { postInsert, userInsert }
    return { props: { repo } }

}) satisfies GetServerSideProps<{ repo: Repo }>

export default function Page({
    repo
}: InferGetStaticPropsType<typeof getServerSideProps>) {

    return (
        <React.Fragment>
            <PostHeader />
            <div className="container flexcol">
                {repo.postInsert && repo.userInsert &&

                    <div className={styles.mainBlogItem}>
                        <PostItem post={repo.postInsert} user={repo.userInsert} />
                    </div>
                }
            </div>
        </React.Fragment>
    )
}