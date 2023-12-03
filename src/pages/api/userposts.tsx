import { NextApiRequest, NextApiResponse } from "next";
import type { userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/errorBoundaries";
// export const config = { runtime: 'experimental-edge' }

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
    // console.log("POSTS@USERID", req.query)
    if (req.method === "GET") {
        const userId = req.query.userId as string
        if (userId) {
            try {
                const userPosts = await prisma.post.findMany({
                    where: {
                        userId: userId
                    }
                });
                if (userPosts) {
                    let tempPosts = userPosts;
                    const userImgPosts = await Promise.all(
                        tempPosts.map(async (post) => {
                            if (post.s3Key) {
                                const params = {
                                    Key: post.s3Key,
                                    Bucket
                                }
                                const command = new GetObjectCommand(params);
                                post.imageUrl = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) })
                            }
                            return post
                        })
                    );
                    return res.status(200).json({ posts: userImgPosts, message: "recieved" })
                } else {
                    return res.status(300).json({ posts: undefined, message: "no posts" })
                }
            } catch (error) {
                const message = getErrorMessage(error);
                console.error(`${message}@userposts`);
                return res.status(500).json({ posts: undefined, message: `${message}@userposts` })
            } finally {
                await prisma.$disconnect();
            }
        } else {
            return res.status(404).json({ posts: undefined, message: "nothin recieved@userposts" })
        }
    }
}