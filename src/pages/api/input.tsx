import { NextApiRequest, NextApiResponse } from "next";
import type { fileType, inputType, userType } from "@lib/Types";
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
    // console.log("INPUT@PUT", req.body)
    if (req.method === "POST") {
        const Input_ = req.body;
        const input = JSON.parse(Input_) as inputType
        try {
            const newInput = await prisma.inputType.create({
                data: {
                    name: input.name,
                    type: input.type,
                    content: input.content,
                    s3Key: input.s3Key,
                    fileId: input.fileId,
                    url: input.url ? input.url : null
                }
            });
            let tempInput = newInput;
            if (tempInput.s3Key) {
                tempInput.url = `${url}/${tempInput.s3Key}`
            }
            return res.status(200).json({ input: tempInput, message: "created" })
        } catch (error) {
            const message = getErrorMessage(error)
            console.error(new Error("server issues@api/file"))
            return res.status(500).json({ input: null, message: `${message}@input` })
        } finally {
            await prisma.$disconnect()
        }
    }
    if (req.method === "PUT") {
        const input = JSON.parse(req.body) as inputType;

        try {
            const updateInput = await prisma.inputType.update({
                where: {
                    id: input.id,
                    fileId: input.fileId
                },
                data: {
                    id: input.id,
                    name: input.name,
                    type: input.type,
                    content: input.content,
                    s3Key: input.s3Key,
                    fileId: input.fileId,
                    url: input.url ? input.url : null
                }
            });

            let tempInput = updateInput;
            if (tempInput.s3Key) {
                tempInput.url = `${url}/${tempInput.s3Key}`
            };

            return res.status(200).json({ input: tempInput, message: "updated" });
        } catch (error) {
            const message = getErrorMessage(error)
            console.error(new Error("server issues@api/file"))
            return res.status(500).json({ input: null, message: `${message}@input` })
        } finally {
            await prisma.$disconnect()
        }
    }
    if (req.method === "GET") {
        const inputId = req.query.inputId as string;
        if (inputId) {
            try {
                const input = await prisma.inputType.findUnique({
                    where: {
                        id: parseInt(inputId),
                    }
                });
                if (input) {
                    let temInput = input;
                    if (temInput.s3Key) {
                        temInput.url = `${url}/${temInput.s3Key}`
                    }
                    return res.status(200).json({ input: temInput, message: "retrieved" })
                }
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(new Error("server issues@api/file"))
                return res.status(500).json({ input: null, message: `${message}@input` })
            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ message: "no filekey" })
        }
    }
    if (req.method === "DELETE") {
        const inputId = req.query.inputId as string;
        if (inputId) {
            try {
                const input = await prisma.inputType.delete({
                    where: {
                        id: parseInt(inputId)
                    }
                });
                if (input) {

                    return res.status(200).json({ input: input, message: "deleted" })
                }
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(`${message}@input@delete`)
                return res.status(500).json({ input: null, message: `${message}@input` })
            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ input: null, message: "no inputkey" })
        }
    }
}