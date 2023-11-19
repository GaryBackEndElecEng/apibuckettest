import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import type { userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/errorBoundaries";
// export const config = { runtime: 'experimental-edge' }
const DB = process.env.DATABASE_URL_AWS as string
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

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const params = req.query;
    const email: string | undefined = params.email as string
    if (req.method === "GET") {
        try {

            if (email) {
                const userEmail = await prisma.user.findUnique({
                    where: {
                        email: email
                    }
                });
                return res.status(200).json({ user: userEmail, message: "found" });
            } else {
                return res.status(200).json({ user: null, message: "no user" })
            }

        } catch (error) {
            return res.status(500).json({ message: `${getErrorMessage(error)}`, user: null })
        } finally {
            await prisma.$disconnect()
        }
    }
}