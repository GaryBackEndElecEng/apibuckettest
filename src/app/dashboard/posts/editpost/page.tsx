import React from 'react'
import MainEditPost from "@component/dashboard/editPost/MainEditPost";
import { Session, getServerSession } from 'next-auth';
import authOptions from "@lib/authOptions";
import Login from "@component/comp/Login";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { fileType, postType, userType, blogLinkType } from '@/lib/Types';
import DashSignup from "@component/dashboard/DashSignup";
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

export async function generateStaticParams() {
    const posts = await getposts();
    return posts.map(post => ({ postId: String(post.id) }))
}

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const postId = searchParams.postId as string;
    const post = await getPost(parseInt(postId));
    const user = await getUser();
    const blogLinks = await getBlogLinkFiles();

    if (user && post) {
        return (
            <MainEditPost getuser={user} getpost={post} getblogLinks={blogLinks} />
        )
    } else if (user && !post) {
        notFound()
    } else {
        return (
            <DashSignup />
        )
    }
}

export async function getUser() {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
        const email = session.user.email;
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if (user) {
                let TUser = user as unknown as userType;
                if (TUser.imgKey) {
                    const params = { Key: TUser.imgKey, Bucket }
                    const command = new GetObjectCommand(params);
                    TUser.image = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
                }
                return TUser
            }
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@editpost@page@user`)
        } finally {
            await prisma.$disconnect()
        }
    }
}

export async function getPost(postId: number) {
    const user = await getUser();
    if (user) {
        try {
            const post = await prisma.post.findUnique({
                where: {
                    id: postId as number,
                    userId: user.id
                },
                include: {
                    rates: true,
                    likes: true
                }
            })
            if (post) {
                let TPost = post as unknown as postType;
                if (TPost.s3Key) {
                    const params = { Key: TPost.s3Key, Bucket }
                    const command = new GetObjectCommand(params);
                    TPost.imageUrl = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
                }
                return TPost
            }
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@editpost@page@getPost`)
        } finally {
            await prisma.$disconnect()
        }
    }
}

export async function getposts() {
    const posts = await prisma.post.findMany();
    await prisma.$disconnect()
    return posts
}
export async function getBlogLinkFiles() {
    const user = await getUser();
    if (user) {
        try {
            const files = await prisma.file.findMany({
                where: {
                    userId: user.id
                },
            })
            if (files) {
                const blogLinks: blogLinkType[] = files.map(file => (
                    {
                        fileId: file.id,
                        name: file.name,
                        title: file.title
                    }
                ));
                return blogLinks
            }
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@editpost@page@getPost`)
        } finally {
            await prisma.$disconnect()
        }
    }
}
