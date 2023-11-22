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
const s3 = new S3Client({

    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region,
})

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const userId = req.query.userId as string
        if (userId) {
            try {
                const userBlogs = await prisma.file.findMany({
                    where: {
                        userId: userId
                    }
                });
                if (userBlogs) {
                    let tempfiles = userBlogs;
                    const userImgBlogs = await Promise.all(
                        tempfiles.map(async (file) => {
                            if (file.imageKey) {
                                const params = {
                                    Key: file.imageKey,
                                    Bucket
                                }
                                const command = new GetObjectCommand(params);
                                file.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
                            }
                            return file
                        })
                    );
                    return res.status(200).json({ files: userImgBlogs, message: "recieved" })
                } else {
                    return res.status(300).json({ files: [], message: "no blogs" })
                }
            } catch (error) {
                const message = getErrorMessage(error);
                console.error(`${message}@userblogs`);
                return res.status(500).json({ files: null, message: `${message}@userblogs` })
            } finally {
                await prisma.$disconnect();
            }
        } else {
            return res.status(404).json({ files: [], message: "nothin recieved@userblogs" })
        }
    }
}