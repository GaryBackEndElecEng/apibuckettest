import type { InferGetServerSidePropsType, GetServerSideProps, GetStaticProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { postType, userType, GetServerSidePropsResult } from '@/lib/Types';
import Blog from "@component/blog/Blog";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/post/post.module.css";
import PostHeader from "@component/post/PostHeader";
import PostItem from "@component/post/PostItem";
// import "../../globalsTwo.css"
import { getErrorMessage } from '@/lib/errorBoundaries';
import { notFound } from 'next/navigation';




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

export async function generateServerParams() {
    const posts = await getposts();
    return posts.map(post => ({ id: post.id }));
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



export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const post = await getPost(id)
    if (post) {
        const user = await getUser(post.userId);
        return (


            <div className={styles.containerPostItem}>
                {post && user &&

                    <div className={styles.mainBlogItem}>
                        <PostItem post={post} user={user} />
                    </div>
                }
            </div>

        )
    } else {
        return (
            notFound()
        )
    }
}

export async function getPost(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(id)
            },
            include: { likes: true, rates: true }
        });
        if (post) {
            const postImg = await insertPostImg(post);
            return postImg
        }

    } catch (error) {
        const message = getErrorMessage(error);
        console.error(`${message}@post/id`)
    } finally {
        await prisma.$disconnect()
    }
}

export async function getUser(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        const userInsert = await insertUserImg(user as userType);
        return userInsert
    } catch (error) {
        const message = getErrorMessage(error);
        console.error(`${message}@post/id`)
    }
}
export async function getposts() {
    const posts = await prisma.post.findMany();
    return posts
}