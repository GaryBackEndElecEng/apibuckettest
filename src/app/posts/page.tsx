import type { ResolvingMetadata, Metadata } from 'next';
import React, { Suspense } from 'react';
import { PrismaClient } from "@prisma/client";
import { postType, userType } from '@/lib/Types';
import Post from "@component/post/Post";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/post/post.module.css";
import PostHeader from "@component/post/PostHeader";
// import "../globalsTwo.css";
import Link from "next/link";
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



// async function insertImg(post: postType) {
//     if (post.s3Key) {
//         const params = {
//             Key: post.s3Key,
//             Bucket
//         }
//         const command = new GetObjectCommand(params);
//         const url1 = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
//         if (url) {
//             post.imageUrl = url1
//         }
//     }
//     return post
// }
// async function insertUserImg(user: userType) {
//     if (user.imgKey) {
//         const params = {
//             Key: user.imgKey,
//             Bucket
//         }
//         const command = new GetObjectCommand(params);
//         const url1 = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
//         if (url1) {
//             user.image = url1
//         }
//     }
//     return user
// }


export default async function Page() {
    const posts = await getPosts();
    const users = await getUsers();
    return (

        <div className={styles.postsIndexContainer}>

            <div className={`${styles.postGrid} mx-auto  bg-slate-300`}>
                <Suspense fallback="Loading....">
                    {posts ? users && posts.map((post, index) => {
                        const user: userType | undefined = users.find(user => (user.id === post.userId))
                        return (
                            <React.Fragment key={index} >
                                <Post post={post} user={user} />
                            </React.Fragment>
                        )

                    })
                        :
                        notFound()
                    }
                </Suspense>
            </div>

        </div>

    )
}

export async function getPosts() {
    const posts = await prisma.post.findMany({ include: { rates: true } }) as postType[];
    const retPosts = posts.map(post => {
        if (post.s3Key) {
            post.imageUrl = `${url}/${post.s3Key}`
        }
        return post
    })
    return retPosts as postType[]
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

type rateType = { id: string, title: string, name: string, rate: number, img: string, author: { name: string, url: string } }

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {

    const posts: postType[] = await getPosts() as unknown[] as postType[]
    const authors_: userType[] = await getUsers() as unknown[] as userType[]
    if (posts && posts.length > 0 && authors_ && authors_.length > 0) {
        const image = "/images/logo_512.png";
        let avgRates: rateType[] = [];

        const rates: rateType[] = posts.map((post, index) => {
            const postId = post.id ? String(post.id) : "#";
            const postImg = post.imageUrl ? post.imageUrl : "#";
            const reduce = post.rates.reduce((a, b) => (a + b.rate), 0);
            const avrate = Math.round(reduce / (post.rates.length))
            const author: userType | undefined = authors_.find((auth: userType) => (auth.id === post.userId));
            const authorFound = (author && author.name) ? { name: author.name, url: `/${author.name}` } : { name: "author", url: "/" };

            return {
                id: postId,
                title: post.name,
                name: post.name,
                rate: avrate,
                img: postImg,
                author: authorFound
            }
        });



        // optionally access and extend (rather than replace) parent metadata
        const previousImages = (await parent)?.openGraph?.images || []
        const prevDesc = (await parent).openGraph?.description;
        const keywords = (await parent).keywords || [];
        const authors = (await parent).authors || [];
        const titles: string = rates.map(rate => (rate.title)).join(",")
        const kwds: string[] = rates.map(rate => (rate.title));
        const images: string[] = rates.map(rate => (rate.img));
        const getAuths = rates.map(auth => (auth.author))
        const desc = titles ? `${titles} posts for you` : `all posts for you`;
        const postUrl = `/posts`
        const newImages = previousImages.concat(images);
        const newKwds = keywords.concat(kwds);
        const newAuths = authors.concat(getAuths)
        return {
            title: `all Blogs- Blog Room Page`,
            description: `${desc}, ${prevDesc}`,
            keywords: newKwds,
            authors: newAuths,

            openGraph: {
                images: [image, ...newImages],
                description: `${desc}, ${prevDesc}`,
                url: postUrl,
            },
        }
    } else {
        return {
            title: ` Blog Room post detail Page`,
            description: "The Blog Room - post detail page",
        }
    }
}