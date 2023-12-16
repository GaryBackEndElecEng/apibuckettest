import { NextApiRequest, NextApiResponse } from "next";
import type { fileType, postType, userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from "@/lib/errorBoundaries";
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const post = JSON.parse(req.body) as postType;
        try {
            const newPost = await prisma.post.create({
                data: {
                    name: post.name,
                    content: post.content,
                    s3Key: post.s3Key,
                    userId: post.userId,
                    bloglink: post.bloglink
                }
            });
            let tempPost = newPost;
            if (tempPost.s3Key) {
                tempPost.imageUrl = `${url}/${tempPost.s3Key}`
            }
            return res.status(200).json({ post: tempPost, message: "created" })
        } catch (error) {
            const message = getErrorMessage(error)
            console.error(`${message}@post`)
        } finally {
            return await prisma.$disconnect()
        }
    }
    if (req.method === "GET") {
        const postId = req.query.postId as string;
        if (postId) {
            try {
                const post = await prisma.post.findUnique({
                    where: {
                        id: parseInt(postId)
                    }
                });
                if (post) {
                    let temPost = post;
                    if (temPost.s3Key) {
                        temPost.imageUrl = `${url}/${temPost.s3Key}`
                    }
                    res.status(200).json({ post: temPost, message: "retieved" })
                }
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(`${message}@post`)
            } finally {
                return await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ message: "no postkey" })
        }
    }
    if (req.method === "PUT") {
        const post = JSON.parse(req.body) as postType;
        // console.log("@ api/post, @PUT", post)
        if (post) {
            try {
                const newPost = await prisma.post.update({
                    where: {
                        id: post.id,
                        userId: post.userId
                    },
                    data: {
                        name: post.name,
                        content: post.content,
                        s3Key: post.s3Key,
                        bloglink: post.bloglink
                    },
                    include: {
                        rates: true,
                        likes: true
                    }
                });
                let tempPost = newPost;
                if (tempPost.s3Key) {
                    tempPost.imageUrl = `${url}/${tempPost.s3Key}`
                }
                return res.status(200).json({ post: tempPost, message: "updated" })
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(`${message}@post`)
            } finally {
                return await prisma.$disconnect()
            }
        } else {
            return res.status(400).json({ post: null, message: "bad request" })
        }
    }
    if (req.method === "DELETE") {
        const postId = req.query.postId as string;
        if (postId) {
            try {
                const post = await prisma.post.delete({
                    where: {
                        id: parseInt(postId)
                    }
                });
                if (post) {
                    return res.status(200).json({ post: post, message: "deleted" })
                }
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(`${message}@post`)
            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ message: "not deleted (no id found)", post: null })
        }
    }
    await prisma.$disconnect()
}