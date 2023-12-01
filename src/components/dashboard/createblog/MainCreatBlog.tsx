
import React from 'react';

import CreateBlog from "@component/dashboard/createblog/CreateBlog"
import type { fileType, userType, inputType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

type mainType = {
    user: userType
}

export default async function MainCreatBlog({ user }: mainType) {
    const newfile = await newFile(user) as fileType;
    return (

        <CreateBlog getuser={user} newfile={newfile} />

    )
}

export async function newFile(user: userType) {
    if (user) {
        try {
            const newfile = await prisma.file.create({
                data: {
                    name: "file name",
                    title: "title",
                    content: "content",
                    fileUrl: "fill",
                    userId: user.id as string
                },
                include: {
                    inputs: true
                }
            });
            return newfile
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@dashboard@page@user`)
        } finally {
            await prisma.$disconnect()
        }
    }
}
