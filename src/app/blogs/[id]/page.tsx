import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { fileType, userType, GetServerSidePropsResult, fileRateType } from '@/lib/Types';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/blog/blog.module.css";
import PostHeader from "@component/post/PostHeader";
import BlogItem from "@component/blog/BlogItem";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { notFound } from "next/navigation";


const url = process.env.BUCKET_URL as string
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

type Repo = {
    fileInsert: fileType,
    userInsert: userType
}



async function insertFileImg(file: fileType): Promise<fileType> {
    if (file.imageKey) {
        file.imageUrl = `${url}/${file.imageKey}`
    }
    const inputs = file.inputs.map(input => {
        if (input.s3Key) {
            input.url = `${url}/${input.s3Key}`
        }
        return input
    })

    return { ...file, inputs: inputs }
}
async function insertUserImg(user: userType): Promise<userType> {
    if (user && user.imgKey) {
        user.image = `${url}/${user.imgKey}`
    }
    return user
}

export async function generateStaticParams() {
    const files = await getFiles();
    return files.map(file => ({ id: file.id }))
}
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const file: fileType | undefined = await getFile(id);
    if (file) {
        const fileInsert = await insertFileImg(file)
        const getuser: userType | undefined = await getUser(file.userId as string)
        const userInsert = await insertUserImg(getuser as userType)


        return (

            <div className={styles.MasterBlogIndex}>
                <div className={styles.blogIndexContainer}>
                    {file && getuser &&


                        <BlogItem file={fileInsert} getuser={userInsert} />

                    }
                </div>
            </div>

        )
    } else {
        notFound();
    }
}

export async function getFile(id: string) {
    try {
        const file = await prisma.file.findUnique({
            where: {
                id: id
            },
            include: { inputs: true, likes: true, rates: true }
        });

        const fileInsert = await insertFileImg(file as fileType);

        return fileInsert
    } catch (error) {
        const message = getErrorMessage(error);
        console.error(`${message}@blogs/id`)
    } finally {
        await prisma.$disconnect()
    }

}

export async function getUser(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        const userInsert = await insertUserImg(user as userType);

        return userInsert
    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }

}

export async function getFiles() {
    const files = await prisma.file.findMany({ include: { rates: true, likes: true } });
    await prisma.$disconnect();
    return files
}

type ratetype = {
    rate: number,
    count: number,
    id: string,
    img: string,
    author: { author: string, url: string },
}

type Props = {
    params: { id: string }
    // searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { id } = params;

    const file: fileType = await getFile(id) as unknown as fileType;
    if (file) {
        const user: userType = await getUser(file.userId) as unknown as userType;
        const name: string = user.name ? user.name : "author";
        const image = "/images/logo_512.png";
        let avgRate: number = 0;
        const reduce = file.rates.reduce((a, b) => (a + b.rate), 0);
        const avrate = Math.round(reduce / (file.rates.length))
        const Rate: ratetype | undefined = {
            count: file.rates.length,
            rate: avrate,
            id: file.id as string,
            img: file.imageUrl ? file.imageUrl : image,
            author: { author: name, url: `/blogs/${file.id}`, }
        };
        const inputImages: (string | null)[] = file.inputs.map((input, index) => {
            if (input.s3Key) {
                input.url = `${url}/${input.s3Key}`
            }
            return input.url
        });

        // optionally access and extend (rather than replace) parent metadata
        const referrer = (await parent).referrer;
        const previousImages = (await parent)?.openGraph?.images || []
        const prevDesc = (await parent).openGraph?.description;
        const emails = (await parent).openGraph?.emails || [];
        const authors = (await parent).authors || []
        const creator = (await parent).creator ? `${name} of www.ablogroom.com from ${(await parent).creator}` : name;
        const newAuthors = [...authors, Rate.author];
        const desc = (file && file.content) ? file.content : `${file.name} description of an author's blog.`;
        const blogUrl = `/blogs/${file.id}`
        const inputImg: typeof previousImages = inputImages && inputImages.length ? [Rate.img, ...inputImages.filter(img => (img !== null))] as string[] : [image]

        return {
            title: `${file.title}:Rating: ${Rate.rate}- Blog Room Page`,
            description: `${desc.slice(0, 100)}..., ${prevDesc}`,
            authors: newAuthors,
            creator: creator,
            referrer,

            openGraph: {
                images: [...inputImg, ...previousImages],
                url: blogUrl,
                emails: [user.email, ...emails]
            },
        }
    } else {
        return {
            title: ` Blog Room blog detail Page`,
            description: "The Blog Room - Blog detail page",
        }
    }
}