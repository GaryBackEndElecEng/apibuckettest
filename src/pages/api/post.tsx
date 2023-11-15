import { NextApiRequest, NextApiResponse } from "next";
import type { fileType, postType, userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const post = req.body as postType;
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
                const params = {
                    Bucket,
                    Key: tempPost.s3Key
                }
                const command = new GetObjectCommand(params);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                if (url) tempPost.imageUrl = url;
            }
            res.status(200).json(tempPost)
        } catch (error) {
            console.error(new Error("server issues@api/Post"))
        } finally {
            await prisma.$disconnect()
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
                        const params = {
                            Bucket,
                            Key: temPost.s3Key as string
                        }
                        const command = new GetObjectCommand(params);
                        temPost.s3Key = await getSignedUrl(s3, command, { expiresIn: 3600 });
                    }
                    res.status(200).json(temPost)
                }
            } catch (error) {
                console.error(new Error("issues @api/post get"))
            } finally {
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ message: "no postkey" })
        }
    }
}