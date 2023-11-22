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
        const useremail = req.query.email as string;
        if (useremail) {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        email: useremail
                    }
                });
                if (user) {
                    let temUser = user;
                    if (temUser.imgKey) {
                        const params = {
                            Bucket,
                            Key: temUser.imgKey as string
                        }
                        const command = new GetObjectCommand(params);
                        temUser.image = await getSignedUrl(s3, command, { expiresIn: 3600 });
                    }
                    res.status(200).json({ user: temUser, message: "retrieved" })
                } else {
                    res.status(404).json({ user: null, message: "no user" })
                }
            } catch (error) {
                console.error(new Error("issues @api/user get"))
            } finally {
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ message: "no key" })
        }
    }

}