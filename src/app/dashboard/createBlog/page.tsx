import React from 'react'
import DashSignup from "@dashboard/DashSignup";
import authOptions from "@lib/authOptions";
import { getServerSession } from 'next-auth';
import MainCreatBlog from "@component/dashboard/createblog/MainCreatBlog";
import type { fileType, userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from "@/lib/errorBoundaries";
// export const config = { runtime: 'experimental-edge' }

const url = process.env.BUCKET_URL;
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

export const dynamic = 'force-dynamic'

export default async function page() {
    const user = await getUser();
    if (user) {
        return (


            <MainCreatBlog user={user} />

        )
    } else {
        return (
            <DashSignup />
        )

    }
}

export async function getUser() {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
        const email = session.user.email
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if (user) {
                let tUser = user as userType;
                if (tUser.imgKey) {
                    tUser.image = `${url}/${tUser.imgKey}`;
                }
                return tUser
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@dashboard@page@user`)
        } finally {
            await prisma.$disconnect()
        }
    }
}
