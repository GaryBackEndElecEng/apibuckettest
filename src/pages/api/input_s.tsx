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


    if (req.method === "GET") {
        const fileId = req.query.fileId as string;
        if (fileId) {
            try {
                const inputs = await prisma.inputType.findMany({
                    where: {
                        fileId: fileId
                    }
                });
                if (inputs) {
                    let temInputs = inputs;
                    const imgInputs = temInputs.map((input) => {
                        if (input.s3Key && input.type === "image") {
                            input.url = `${url}/${input.s3Key}`;
                        }
                        return input
                    });
                    return res.status(200).json({ inputs: imgInputs, message: "retrieved" })
                } else {
                    return res.status(300).json({ inputs: [], message: "no inputs" })
                }

            } catch (error) {
                const message = getErrorMessage(error)
                console.error(new Error("server issues@api/file"))
                return res.status(500).json({ inputs: [], message: `${message}@input` })
            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ message: "no filekey" })
        }
    }

}