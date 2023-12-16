import React from 'react';
import { Session, getServerSession } from 'next-auth';
import authOptions from "@lib/authOptions";
import Login from "@component/comp/Login";
import MasterEditBlog from "@component/dashboard/editblog/MasterEditBlog";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import styles from "@component/dashboard/editblog/editblog.module.css"
import { getErrorMessage } from '@/lib/errorBoundaries';
import { fileType, userType } from '@/lib/Types';
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

export async function generatStaticParams() {
    const userFiles = await getFiles();
    return userFiles.map(file => ({ fileId: file.id }))
}
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const fileId = searchParams.fileId as string;
    const user = await getUser();
    const file = await getFile(fileId);
    if (user) {
        return (
            <MasterEditBlog user={user} file={file} />

        )
    } else {
        return (
            <div className={styles.loginfix}>
                <Login />
            </div>
        )
    }
}

export async function getUser() {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
        const email = session.user.email
        try {
            const user = await prisma.user.findUnique({
                where: { email: email }
            });
            if (user) {
                let tempUser = user;
                if (tempUser.imgKey) {
                    tempUser.image = `${url}/${tempUser.imgKey}`
                }
                return tempUser as userType
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@editblog@page@getuser`)
        } finally {
            await prisma.$disconnect()
        }
    }
}
export async function getFile(fileId: string) {
    try {
        const file = await prisma.file.findUnique({
            where: { id: fileId },
            include: {
                inputs: true,
                likes: true,
                rates: true
            }
        });
        if (file) {
            let tempFile = file as fileType;
            if (tempFile.imageKey) {
                tempFile.imageUrl = `${url}/${tempFile.imageKey}`;
            }
            const neInputs = tempFile.inputs.map(input => {
                if (input.s3Key && input.type === "image") {
                    input.url = `${url}/${input.s3Key}`;
                }
                return input;
            })
            const newFile = ({ ...tempFile, inputs: neInputs }) as fileType
            return newFile
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error(`${message}@editblog@page@getuser`)
    } finally {
        await prisma.$disconnect()
    }
}

export async function getFiles() {
    const files = await prisma.file.findMany();
    await prisma.$disconnect()
    return files
}

