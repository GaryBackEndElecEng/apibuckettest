import type { InferGetServerSidePropsType, GetServerSideProps, Metadata, ResolvingMetadata } from 'next';
import React, { Suspense } from 'react';
import { PrismaClient } from "@prisma/client";
import { fileType, userType } from '@/lib/Types';
import Blog from "@component/blog/Blog";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/blog/blog.module.css";
import PostHeader from "@component/post/PostHeader";
import { notFound } from "next/navigation";



const url = process.env.BUCKET_URL as string
// const url = "https://garyposttestupload.s3.amazonaws.com"
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

export const dynamic = "force-dynamic";


export default async function Page() {
    const files = await getFiles();
    const users = await getUsers();
    // console.log("users", users, "files", files)
    return (

        <div className={styles.blogsIndexContainer}>
            <div className={`${styles.blogGrid}  mx-auto place-items-center bg-slate-300 `}>
                <Suspense fallback="Loading....">
                    {(files && users) ? files.map((file, index) => {
                        if (file.published === true) {
                            const user: userType | undefined = users.find(user => ((user.id as string) === file.userId))
                            return (

                                <React.Fragment key={index}>
                                    <Blog file={file} user={user} />
                                </React.Fragment>

                            )
                        }

                    })
                        :
                        notFound()
                    }
                </Suspense>
            </div>
        </div>

    )
}

export async function getFiles() {
    const files = await prisma.file.findMany({ include: { rates: true } });
    const fileInserts = files.map(file => {
        if (file.imageKey) {
            file.imageUrl = `${url}/${file.imageKey}`

        }
        return file
    });
    return fileInserts as fileType[]
}
export async function getUsers() {
    const users = await prisma.user.findMany() as userType[];
    const usersInserts = users.map(user => {
        if (user.imgKey) {
            user.image = `${url}/${user.imgKey}`
        }

        return user

    })
    return usersInserts
}


type rateType = { id: string, title: string, name: string, rate: number, img: string, author: string }

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {

    const files: fileType[] = await getFiles() as unknown[] as fileType[]
    const authors_: userType[] = await getUsers() as unknown[] as userType[]
    if (files && files.length > 0 && authors_ && authors_.length > 0) {
        const image = "/images/logo_512.png";
        let avgRates: rateType[] = [];

        const rates: rateType[] = files.map((file, index) => {
            const fileId = file.id ? file.id : "#";
            const fileImg = file.imageUrl ? file.imageUrl : "#";
            const reduce = file.rates.reduce((a, b) => (a + b.rate), 0);
            const avrate = Math.round(reduce / (file.rates.length))
            const author: userType | undefined = authors_.find((auth: userType) => (auth.id === file.userId));
            const authorFound = (author && author.name) ? author.name : "author";

            return {
                id: fileId,
                title: file.title,
                name: file.name,
                rate: avrate,
                img: fileImg,
                author: authorFound
            }
        });



        // optionally access and extend (rather than replace) parent metadata
        const referrer = (await parent).referrer;
        const previousImages = (await parent)?.openGraph?.images || []
        const prevDesc = (await parent).openGraph?.description;
        const keywords = (await parent).keywords || [];
        const authors = (await parent).authors || [];
        const titles: string = rates.map(rate => (rate.title)).join(",")
        const kwds: string[] = rates.map(rate => (rate.title));
        const images: string[] = rates.map(rate => (rate.img));
        const getAuths = rates.map(auth => ({ name: auth.author, url: `/blogs/${auth.id}` }))
        const desc = titles ? `${titles} blogs for you` : `all blogs for you`;
        const blogUrl = `/blogs`
        const newImages = previousImages.concat(images);
        const newKwds = keywords.concat(kwds);
        const newAuths = authors.concat(getAuths)
        return {
            title: `all Blogs- Blog Room Page`,
            description: `${desc}, ${prevDesc}`,
            keywords: newKwds,
            authors: newAuths,
            referrer,

            openGraph: {
                images: [image, ...newImages],
                description: `${desc}, ${prevDesc}`,
                url: blogUrl,
            },
        }
    } else {
        return {
            title: ` Blog Room post detail Page`,
            description: "The Blog Room - post detail page",
        }
    }
}