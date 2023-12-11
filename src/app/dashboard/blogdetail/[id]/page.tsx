
import React from 'react';
import { useSession } from 'next-auth/react';
import DashSignup from "@component/dashboard/DashSignup";
import { useGeneralContext } from '@/components/context/GeneralContextProvider';
import { fileType, userType } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import GenericMsg from "@component/comp/GenericMsg";
import BlogDetail from "@component/dashboard/blogdetail/BlogDetail";
import authOptions from "@lib/authOptions";
import { Session, getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import styles from "@component/dashboard/blogdetail/blogdetailStyle.module.css";
import Link from "next/link";
// export const config = { runtime: 'experimental-edge' }

const url = process.env.BUCKET_URL as string;
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

export async function generateStaticParams() {
    const getUserfiles = await getFiles();
    return getUserfiles.map(file => ({ id: file.id }))
}


export default async function PageDetail({ params }: { params: { id: string } }) {
    const { id } = params;
    const session = await getServerSession(authOptions);
    const user = await getUser(session)
    const file = await getFile(id);




    if (user && file) {

        return (
            <div className={styles.detailPageContainer}>
                <BlogDetail file={file} getuser={user as userType} />
                <Link href={"/dashboard"} className={`my-4 text-center ${styles.backLink}`}>
                    <button className="buttonsm bg-slate-600 text-white">back<span className="text-xl text-red-900 ml-1">?</span></button>
                </Link>
            </div>
        )
    } else {
        return (
            <DashSignup />
        )
    }
}

export async function getFile(id: string): Promise<fileType | undefined> {

    if (id) {
        try {
            const file = await prisma.file.findUnique({
                where: {
                    id: id,
                },
                include: {
                    inputs: true,
                    likes: true,
                    rates: true
                }
            });

            if (file) {
                let tempFile = file;

                if (tempFile.imageKey) {
                    tempFile.imageUrl = `${url}/${tempFile.imageKey}`;
                }
                tempFile.inputs.map(async (input) => {
                    if (input.s3Key) {
                        input.url = `${url}/${input.s3Key}`
                    }
                    return input
                })
                return tempFile
            }

        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@page@dashboard/blog`);

        } finally {
            await prisma.$disconnect()
        }
    }

}
export async function getFiles() {

    const userFiles = await prisma.file.findMany();
    await prisma.$disconnect()
    return userFiles

}

export async function getUser(session: Session | null) {

    if (session && session.user) {
        const email = session.user?.email
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email as string
                }
            });
            if (user) {
                let temUser = user;
                if (temUser.imgKey) {
                    temUser.image = `${url}/${temUser.imgKey}`;
                }
                return temUser
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.log(`${message}@page@blogDetail`)
        } finally {
            await prisma.$disconnect()
        }
    }
}