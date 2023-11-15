import { NextApiRequest, NextApiResponse } from "next";
import type { fileType, userType } from "@lib/Types";
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
        const file = req.body as fileType;
        try {
            const newFile = await prisma.file.create({
                data: {
                    name: file.name,
                    title: file.title,
                    content: file.content,
                    imageKey: file.imageKey,
                    published: file.published,
                    userId: file.userId,
                    fileUrl: "fill"
                }
            });
            const newFile2 = await prisma.file.update({
                where: { id: newFile.id },
                data: {
                    fileUrl: `/blog/${newFile.id}`
                }
            })
            let tempFile = newFile2;
            if (tempFile.imageKey) {
                const params = {
                    Bucket,
                    Key: tempFile.imageKey
                }
                const command = new GetObjectCommand(params);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                if (url) tempFile.imageUrl = url;
            }
            res.status(200).json(tempFile)
        } catch (error) {
            console.error(new Error("server issues@api/file"))
        } finally {
            await prisma.$disconnect()
        }
    }
    if (req.method === "GET") {
        const fileId = req.query.fileId as string;
        if (fileId) {
            try {
                const file = await prisma.file.findUnique({
                    where: {
                        id: fileId
                    }
                });
                if (file) {
                    let temFile = file;
                    if (temFile.imageKey) {
                        const params = {
                            Bucket,
                            Key: temFile.imageKey as string
                        }
                        const command = new GetObjectCommand(params);
                        temFile.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
                    }
                    res.status(200).json(temFile)
                }
            } catch (error) {
                console.error(new Error("issues @api/file get"))
            } finally {
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ message: "no filekey" })
        }
    }
}