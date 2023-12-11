import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import React, { Suspense } from 'react';
import { PrismaClient } from "@prisma/client";
import { postType, userType } from '@/lib/Types';
import Post from "@component/post/Post";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/post/post.module.css";
import PostHeader from "@component/post/PostHeader";
// import "../globalsTwo.css";
import Link from "next/link";
import { notFound } from "next/navigation";


const url = process.env.BUCKET_URL as string
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



// async function insertImg(post: postType) {
//     if (post.s3Key) {
//         const params = {
//             Key: post.s3Key,
//             Bucket
//         }
//         const command = new GetObjectCommand(params);
//         const url1 = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
//         if (url) {
//             post.imageUrl = url1
//         }
//     }
//     return post
// }
// async function insertUserImg(user: userType) {
//     if (user.imgKey) {
//         const params = {
//             Key: user.imgKey,
//             Bucket
//         }
//         const command = new GetObjectCommand(params);
//         const url1 = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
//         if (url1) {
//             user.image = url1
//         }
//     }
//     return user
// }


export default async function Page() {
    const posts = await getPosts();
    const users = await getUsers();
    return (

        <div className={styles.postsIndexContainer}>

            <div className={`${styles.postGrid} mx-auto  bg-slate-300`}>
                <Suspense fallback="Loading....">
                    {posts ? users && posts.map((post, index) => {
                        const user: userType | undefined = users.find(user => (user.id === post.userId))
                        return (
                            <React.Fragment key={index} >
                                <Post post={post} user={user} />
                            </React.Fragment>
                        )

                    })
                        :
                        notFound()
                    }
                </Suspense>
            </div>

        </div>

    )
}

export async function getPosts() {
    const posts = await prisma.post.findMany({ include: { rates: true } }) as postType[];
    const retPosts = posts.map(post => {
        if (post.s3Key) {
            post.imageUrl = `${url}/${post.s3Key}`
        }
        return post
    })
    return retPosts as postType[]
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