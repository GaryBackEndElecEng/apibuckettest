import type { GetServerSideProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { fileType, userType, GetServerSidePropsResult } from '@/lib/Types';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/blog/blog.module.css";
import PostHeader from "@component/post/PostHeader";
import BlogItem from "@component/blog/BlogItem";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { notFound } from "next/navigation";



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
        const url = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
        if (url) {
            file.imageUrl = url
        }
    }
    const inputs = await Promise.all(
        file.inputs.map(async (input) => {
            if (input.s3Key) {
                const params = { Key: input.s3Key, Bucket };
                const command = new GetObjectCommand(params);
                input.url = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
            }
            return input
        })
    );

    return { ...file, inputs: inputs }
}
async function insertUserImg(user: userType): Promise<userType> {
    if (user && user.imgKey) {
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

export async function generateServerParams() {
    const files = await getFiles();
    return files.map(file => ({ id: file.id }))


}

export default async function BlogPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const file: fileType | undefined = await getFile(id);
    if (file) {
        const fileInsert = await insertFileImg(file)
        const getuser: userType | undefined = await getUser(file.userId as string)
        const userInsert = await insertUserImg(getuser as userType)


        return (

            <div className={styles.MasterBlogIndex}>
                <div className={styles.blogIndexContainer}>
                    {file && getuser &&


                        <BlogItem file={fileInsert} getuser={userInsert} />

                    }
                </div>
            </div>

        )
    } else {
        notFound();
    }
}

export async function getFile(id: string) {
    try {
        const file = await prisma.file.findUnique({
            where: {
                id: id
            },
            include: { inputs: true, likes: true, rates: true }
        });

        const fileInsert = await insertFileImg(file as fileType);

        return fileInsert
    } catch (error) {
        const message = getErrorMessage(error);
        console.error(`${message}@blogs/id`)
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

    } finally {
        await prisma.$disconnect()
    }

}

export async function getFiles() {
    const files = await prisma.file.findMany();
    await prisma.$disconnect();
    return files
}