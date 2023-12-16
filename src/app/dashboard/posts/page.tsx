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

const url = process.env.BUCKET_URL as string;
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

// export const dynamic = "force-dynamic";

export async function getposts(user: userType) {

    if (user) {
        try {
            const userPosts = await prisma.post.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    rates: true,
                    likes: true
                }
            })
            let tempPosts = userPosts as unknown[] as postType[];
            tempPosts.map(post => {
                if (post.s3Key) {
                    post.imageUrl = `${url}/${post.s3Key}`
                }
                return post
            });

            return tempPosts
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@dashboard@posts@page`)
        } finally {
            await prisma.$disconnect()
        }
    }
}


export default async function Posts() {
    const user = await getUser();

    if (user) {
        const userPosts = await getposts(user);
        // console.log("Posts=>userPosts", userPosts)
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


export async function getUser() {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
        const email = session.user.email;
        try {
            const user = await prisma.user.findMany({
                where: {
                    email: email
                },

            });
            let TUser = user as unknown as userType;
            if (TUser.imgKey) {
                TUser.image = `${url}/${TUser.imgKey}`
            }
            return TUser
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@dashboard@posts@page`)
        } finally {
            await prisma.$disconnect()
        }
    }
}

