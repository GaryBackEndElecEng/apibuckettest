import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import type { userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client/edge';
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

const prisma = new PrismaClient({ datasources: { db: { url: DB } } });

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const email: string | undefined = params.get("email") as string

    try {

        if (email) {
            const userEmail = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            return NextResponse.json({ user: userEmail, status: 200 });
        } else {
            return NextResponse.json({ user: null, status: 305 })
        }

    } catch (error) {
        return NextResponse.json({ status: 500, message: `${getErrorMessage(error)}` })
    } finally {
        await prisma.$disconnect()
    }
}