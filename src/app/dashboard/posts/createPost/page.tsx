import React from 'react';
import MainCreatePost from "@component/dashboard/createPost/MainCreatePost";
import { Session, getServerSession } from 'next-auth';
import authOptions from "@lib/authOptions";
import Login from "@component/comp/Login";
import { PrismaClient } from '@prisma/client';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { postType, userType } from '@/lib/Types';

const prisma = new PrismaClient();

const url = process.env.BUCKET_URL as string;

export default async function page() {
    const user = await getUser() as userType;
    if (user) {
        const newpost = await newPost(user.id as string) as postType;
        return (
            <MainCreatePost getuser={user} newpost={newpost} />
        )
    } else {
        return (
            <Login />
        )
    }
}
export async function getUser() {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email
                },
                include: {
                    files: true,
                    posts: true
                }
            });
            if (user) {
                let tempuser = user;
                if (tempuser.imgKey) {
                    tempuser.image = `${url}/${tempuser.imgKey}`
                }
                if (tempuser.posts) {
                    tempuser.posts.map(post => {
                        if (post.s3Key) {
                            post.imageUrl = `${url}/${post.s3Key}`
                        }
                        return post
                    });
                }
                if (tempuser.files) {
                    tempuser.files.map(file => {
                        if (file.imageKey) {
                            file.imageUrl = `${url}/${file.imageKey}`
                        }
                        return file
                    });
                }
                return tempuser
            }

        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@dashboard/CreatePost/page@prisma@user`)
        } finally {
            await prisma.$disconnect()
        }
    }
}

export async function newPost(userId: string) {
    try {
        const isPost = await prisma.post.findMany({
            where: {
                content: "content",
                userId: userId
            }
        });
        if (isPost[0]) {
            return isPost[0] as unknown as postType
        } else {
            const newpost = await prisma.post.create({
                data: {
                    name: "title",
                    content: "content",
                    userId: userId
                }
            });
            return newpost as unknown as postType
        }
    } catch (error) {
        const msg = getErrorMessage(error);
        console.error(`${msg}@dashboard/CreatePost/page@prisma@post`)
    } finally {
        await prisma.$disconnect()
    }
}


