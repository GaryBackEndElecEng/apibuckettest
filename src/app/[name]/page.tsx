import React from 'react'
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from "@/lib/errorBoundaries";
import styles from "@component/userpage/userpage.module.css";
import { userType } from '@/lib/Types';
import MainUserPage from "@component/userpage/MainUserPage";
import { redirect } from 'next/navigation';
import Redirect from "@component/comp/Redirect";
import { notFound } from "next/navigation";

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

export async function generateStaticParams({ params }: { params: { name: string } }) {
    const users = await getUsers();
    return users.map(user => ({ name: user.name }))

}

export default async function Userpage({ params }: { params: { name: string } }) {
    const { name } = params;
    const user: userType | undefined = await getUser(name) as userType
    if (user) {
        return (
            <div className={styles.pageContainer}>
                <MainUserPage user={user} />
            </div>
        )
    } else {
        notFound()
    }
}

export async function getUser(name: string) {
    if (name) {
        const getname = name;
        try {
            const user = await prisma.user.findFirst({
                where: {
                    name: getname
                },
                include: {
                    files: {
                        include: {
                            rates: true
                        }
                    }
                }
            });
            if (user) {
                let tempUser = user;
                if (tempUser.imgKey) {
                    const params = {
                        Key: tempUser.imgKey,
                        Bucket
                    }
                    const command = new GetObjectCommand(params);
                    tempUser.image = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
                }
                const files = await Promise.all(
                    tempUser.files.map(async (file) => {
                        if (file.imageKey) {
                            const params = {
                                Key: file.imageKey,
                                Bucket
                            }
                            const command = new GetObjectCommand(params);
                            file.imageUrl = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
                        }
                        return file
                    }));
                const newUser = { ...tempUser, files: files }
                return newUser
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@page@userPage`)
        } finally {
            await prisma.$disconnect()
        }
    }
}

export async function getUsers() {
    const users = await prisma.user.findMany();
    await prisma.$disconnect()
    return users
}
