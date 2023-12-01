import React from 'react';
import MainPosts from "@component/dashboard/posts/MainPosts";
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import styles from "@component/dashboard/posts/posts.module.css";
import Login from "@component/comp/Login";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { fileType, postType, userType } from '@/lib/Types';
// export const config = { runtime: 'experimental-edge' }

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



export default async function Posts() {
    const user = await getUser();
    const userPosts = await getPosts();

    if (user) {
        return (
            <div className={styles.mainPagePosts}>
                <MainPosts getuser={user} getposts={userPosts} />
            </div>
        )
    } else {
        return (
            <div className={styles.loginfix}>
                <Login />
            </div>

        )
    }
}

export async function getPosts() {
    const user = await getUser();
    if (user) {
        try {
            const posts = await prisma.post.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    rates: true,
                    likes: true
                }
            });
            if (posts) {
                let TPosts = posts as unknown as postType[]
                const getPosts = await Promise.all(
                    TPosts.map(async (post) => {
                        if (post.s3Key) {
                            const params = { Key: post.s3Key, Bucket }
                            const command = new GetObjectCommand(params);
                            post.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
                        }
                        return post
                    })
                );
                return getPosts
            }
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@dashboard@posts@page`)
        } finally {
            await prisma.$disconnect()
        }
    }
}

export async function getUser() {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
        const email = session.user.email;
        try {
            const user = await prisma.user.findMany({
                where: {
                    email: email
                }
            });
            if (user) {
                let TUser = user as unknown as userType;
                if (TUser.imgKey) {
                    const params = { Key: TUser.imgKey, Bucket }
                    const command = new GetObjectCommand(params);
                    TUser.image = await getSignedUrl(s3, command, { expiresIn: 3600 });
                }
                return TUser
            }
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@dashboard@posts@page`)
        } finally {
            await prisma.$disconnect()
        }
    }
}

