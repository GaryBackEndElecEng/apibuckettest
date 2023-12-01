
import React from 'react';
import Dashboard_ from "@/components/dashboard/DashBoard_"
import type { fileType, postType, userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from "@/lib/errorBoundaries";
// export const config = { runtime: 'experimental-edge' }

const prisma = new PrismaClient();

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
type maindashType = {
    user: userType,
}

export default async function MainDash({ user }: maindashType) {
    const userFiles: fileType[] | [] = await getFiles(user) as fileType[];
    const userPosts: postType[] = await getPosts(user) as postType[];
    return (

        // <Dashboard_ContextProvider>
        <Dashboard_ getuser={user} files={userFiles} posts={userPosts} />


    )
}

export async function getFiles(user: userType) {
    try {
        const files = await prisma.file.findMany({
            where: {
                userId: user.id
            },
            include: {
                rates: true,
                likes: true
            }
        });
        if (files) {
            let tFiles = files;
            const newFiles = await Promise.all(
                tFiles.map(async (file) => {
                    if (file.imageKey) {
                        const params = { Key: file.imageKey, Bucket }
                        const command = new GetObjectCommand(params);
                        file.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
                    }
                    return file;
                })
            );

            return newFiles as fileType[]
        } else {
            return files as fileType[]
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error(`${message}@MainDash@dashboard@getFiles`)
    } finally {
        await prisma.$disconnect()
    }

}
export async function getPosts(user: userType) {
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
            return posts as postType[]
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error(`${message}@MainDash@dashboard@getPosts`)
    } finally {
        await prisma.$disconnect()
    }

}
