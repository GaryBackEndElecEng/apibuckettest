import { NextApiRequest, NextApiResponse } from "next";
import type { fileType, userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from "@/lib/errorBoundaries";
// export const config = { runtime: 'experimental-edge' }

const url = process.env.BUCKET_URL as string;
const Bucket = process.env.BUCKET_NAME as string;
const region = process.env.BUCKET_REGION as string;
const accessKeyId = process.env.SDK_ACCESS_KEY as string;
const secretAccessKey = process.env.SDK_ACCESS_SECRET as string;
const expiresIn = process.env.EXPIRESIN as string;
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
        const file = JSON.parse(req.body) as fileType;
        try {
            const newFile = await prisma.file.create({
                data: {
                    name: file.name,
                    title: file.title ? file.title : "title",
                    content: file.content ? file.content : "content",
                    imageKey: file.imageKey ? file.imageKey : null,
                    published: false,
                    userId: file.userId,
                    fileUrl: "fill"
                }
            });
            if (newFile) {
                const newFile2 = await prisma.file.update({
                    where: { id: newFile.id },
                    data: {
                        fileUrl: `/blog/${newFile.id}`
                    }
                })
                let tempFile = newFile2;
                if (tempFile.imageKey) {
                    tempFile.imageUrl = `${url}/${tempFile.imageKey}`
                }
                return res.status(200).json({ file: tempFile, message: "created" })
            }
        } catch (error) {
            const message = getErrorMessage(error)
            console.error(message)
            res.status(500).json({ file: null, message: message })
        } finally {
            await prisma.$disconnect()
        }
    }
    if (req.method === "PUT") {
        const file = JSON.parse(req.body) as fileType;
        try {
            const updateFile = await prisma.file.update({
                where: {
                    id: file.id,
                    userId: file.userId
                },
                data: {
                    name: file.name,
                    title: file.title,
                    content: file.content,
                    imageKey: file.imageKey,
                    published: file.published,
                    fileUrl: file.fileUrl,
                    imageUrl: file && file.imageUrl ? file.imageUrl : null
                }
            });

            let tempFile = updateFile;
            if (tempFile.imageKey) {
                tempFile.imageUrl = `${url}/${tempFile.imageKey}`
            }
            return res.status(200).json({ file: tempFile, message: "updated" })
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}`)
            return res.status(500).json({ file: null, message: message })
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
                    },
                });
                if (file) {
                    let temFile = file;
                    if (temFile.imageKey) {
                        temFile.imageUrl = `${url}/${temFile.imageKey}`
                    }
                    return res.status(200).json({ file: temFile, message: "retrieved" })
                }
            } catch (error) {
                const message = getErrorMessage(error);
                console.error(`${message}`)
                return res.status(500).json({ file: null, message: message })
            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ message: "no filekey" })
        }
    }
    if (req.method === "DELETE") {
        const fileId = req.query.fileId as string;
        if (fileId) {
            try {
                const file = await prisma.file.delete({
                    where: {
                        id: fileId
                    }
                });
                if (file) {

                    return res.status(200).json({ file: file, message: "deleted" })
                }
            } catch (error) {
                const message = getErrorMessage(error);
                console.error(`${message}`)
                return res.status(500).json({ file: null, message: message })
            } finally {
                return await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ file: null, message: "no filekey" })
        }
    }
    await prisma.$disconnect()
}