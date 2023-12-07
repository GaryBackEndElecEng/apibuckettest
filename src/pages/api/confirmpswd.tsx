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

type pswdType = {
    loaded: boolean,
    message: string,
    pswd: string
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        const pswd = req.query.pswd as string;
        const email = req.query.email as string;
        if (email && pswd) {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        email: email
                    }
                });

                if (user) {
                    const check: boolean = (user.password === pswd) ? true : false;
                    if (check) {
                        res.status(200).json({ loaded: check, message: "passed", pswd: user.password })
                    } else {
                        res.status(200).json({ loaded: check, message: "no match", pswd: user.password })
                    }
                } else {
                    res.status(404).json({ message: "no user", user: null })
                }
            } catch (error) {
                const msg = getErrorMessage(error);
                console.error(new Error(` issues: ${msg}@confirmpswd`))
            } finally {
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ message: "no key", user: null })
        }
    }


}