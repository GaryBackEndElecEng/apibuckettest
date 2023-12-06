import { NextApiRequest, NextApiResponse } from "next";
import type { contactType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
    // console.log("INPUT@PUT", req.body)

    if (req.method === "GET") {
        const userId = req.query.userId as string;
        if (userId) {
            try {
                const contacts = await prisma.contact.findMany({
                    where: {
                        userId: userId as string,
                    }
                });
                return res.status(200).json({ contact: contacts, message: "retrieved" })
            } catch (error) {
                const message = getErrorMessage(error)
                res.status(500).json({ contacts: null, message: `${message}@usercontacts` })
                console.error(new Error(`server issues:${message} @usercontacts@get`));


            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ contast: [], message: "could not find userId" })
        }
    }

}