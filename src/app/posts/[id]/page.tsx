import type { InferGetServerSidePropsType, GetServerSideProps, GetStaticProps, InferGetStaticPropsType, Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { PrismaClient } from "@prisma/client";
import { postType, userType, GetServerSidePropsResult } from '@/lib/Types';
import Blog from "@component/blog/Blog";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from "uuid";
import styles from "@component/post/post.module.css";
import PostHeader from "@component/post/PostHeader";
import PostItem from "@component/post/PostItem";
// import "../../globalsTwo.css"
import { getErrorMessage } from '@/lib/errorBoundaries';
import { notFound } from 'next/navigation';



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
    postInsert: postType,
    userInsert: userType
}

// export async function generateStaticParams() {
//     const posts = await getposts();
//     return posts.map(post => ({ id: post.id }))
// }
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

async function insertPostImg(post: postType): Promise<postType> {
    if (post.s3Key) {
        post.imageUrl = `${url}/${post.s3Key}`
    }
    return post
}
async function insertUserImg(user: userType): Promise<userType> {
    if (user.imgKey) {
        user.image = `${url}/${user.imgKey}`
    }
    return user
}



export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const post = await getPost(id)
    if (post) {
        const user = await getUser(post.userId);
        return (


            <div className={styles.containerPostItem}>
                {post && user &&


                    <PostItem post={post} user={user} />

                }
            </div>

        )
    } else {
        return (
            notFound()
        )
    }
}

export async function getPost(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(id)
            },
            include: { likes: true, rates: true }
        });
        if (post) {
            const postImg = await insertPostImg(post);
            return postImg
        }

    } catch (error) {
        const message = getErrorMessage(error);
        console.error(`${message}@post/id`)
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
        const message = getErrorMessage(error);
        console.error(`${message}@post/id`)
    }
}
export async function getposts() {
    const posts = await prisma.post.findMany();
    return posts
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

    const post: postType | undefined = await getPost(id) as unknown as postType;

    if (post) {
        const user: userType = await getUser(post.userId) as unknown as userType;
        const name: string = user.name ? user.name : "author";
        const image = "/images/logo_512.png";
        const blogLink = post.bloglink ? post.bloglink : "https://www.ablogroom.com/blogs";
        const reduce = post.rates.reduce((a, b) => (a + b.rate), 0);
        const avrate = Math.round(reduce / (post.rates.length))
        const Rate: ratetype | undefined = {
            count: post.rates.length,
            rate: avrate,
            id: String(post.id),
            img: post.imageUrl ? post.imageUrl : image,
            author: { author: name, url: blogLink, }
        };


        // optionally access and extend (rather than replace) parent metadata
        const referrer = (await parent).referrer;
        const previousImages = (await parent)?.openGraph?.images || []
        const prevDesc = (await parent).openGraph?.description;
        const emails = (await parent).openGraph?.emails || [];
        const authors = (await parent).authors || []
        const creator = (await parent).creator ? `${name} of ${(await parent).creator}` : name;
        const newAuthors = [...authors, Rate.author];
        const desc = (post && post.content) ? post.content : `${post.name} description of an author's blog.`;
        const blogUrl = `/blogs/${post.id}`

        return {
            title: `${post.name}:Rating: ${Rate.rate}- Blog Room Page`,
            description: `${desc}, ${prevDesc}`,
            authors: newAuthors,
            creator: creator,
            referrer,

            openGraph: {
                images: [Rate.img, ...previousImages],
                url: blogUrl,
                emails: [user.email, ...emails]
            },
        }
    } else {
        return {
            title: ` Blog Room post detail Page`,
            description: "The Blog Room - post detail page",
        }
    }
}