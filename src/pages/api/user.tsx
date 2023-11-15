import { NextApiRequest, NextApiResponse } from "next";
import type { userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from "uuid";
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
        const user = req.body as userType;
        try {
            const newUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    imgKey: user.imgKey,
                    bio: user.bio
                }
            });
            let tempUser = newUser;
            if (tempUser.imgKey) {
                const params = {
                    Bucket,
                    Key: tempUser.imgKey
                }
                const command = new GetObjectCommand(params);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                if (url) tempUser.image = url;
            }
            res.status(200).json(tempUser)
        } catch (error) {
            console.error(new Error("server issues@api/user"))
        } finally {
            await prisma.$disconnect()
        }
    }
    if (req.method === "GET") {
        const userId = req.query.userId as string;
        if (userId) {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: userId
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
                    res.status(200).json(temUser)
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