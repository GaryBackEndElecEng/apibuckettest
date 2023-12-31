import React from 'react'
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from "@/lib/errorBoundaries";
import styles from "@component/userpage/userpage.module.css";
import { fileType, postType, userType } from '@/lib/Types';
import MainUserPage from "@component/userpage/MainUserPage";
import { redirect } from 'next/navigation';
import Redirect from "@component/comp/Redirect";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from 'next';
import { NameSep, joinName, separateName, unifyName } from "@lib/ultils";

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
    const users = await getUsers();
    return users.map(user => ({ name: joinName(user.name as string) }))

}

export const revalidate = 0;
export const dynamic = "force-dynamic"

export default async function Userpage({ params }: { params: { name: string } }) {
    const { name } = params;
    const newName = separateName(name);
    const users = await getUsers();
    const isUser = users.find(user => (user.name === newName));
    const check: boolean = isUser ? true : false;
    if (check) {
        const user: userType | undefined = await getUser(newName) as userType

        if (user && user.email) {
            return (
                <div className={styles.pageContainer}>
                    <MainUserPage user={user} />
                </div>
            )
        } else {
            notFound()
        }
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
                            rates: true,
                            likes: true
                        }
                    },
                    posts: {
                        include: {
                            rates: true,
                            likes: true
                        }
                    }
                }
            });
            if (user) {
                let tempUser = user;
                if (tempUser.imgKey) {
                    tempUser.image = `${url}/${tempUser.imgKey}`
                } else {
                    tempUser.image = null
                }
                const files = tempUser.files.map((file) => {
                    if (file.imageKey) {
                        file.imageUrl = `${url}/${file.imageKey}`;
                    }
                    return file
                });
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
    const users = await prisma.user.findMany({ include: { files: true, posts: true } });
    const getusers = users.map(user => {
        return user
    })
    await prisma.$disconnect()
    return getusers
}

type rateType = {
    id: string, title: string,
    name: string,
    rate: number,
    img: string,
    author: { name: string, url: string }
}


export async function generateMetadata({ params }: { params: { name: string } }, parent: ResolvingMetadata): Promise<Metadata | undefined> {
    const { name } = params;
    const newname = separateName(name)
    const users = await getUsers();
    const isUser = users.find(user => (user.name === newname));
    const check: boolean = isUser ? true : false;

    if (check) {
        const getuser: userType = await getUser(newname) as unknown as userType;

        const posts: postType[] = getuser.posts;
        const files: fileType[] = getuser.files;
        const image = "/images/logo_512.png";
        const userImage = (getuser && getuser.image) ? getuser.image : image;
        const authorFound = (getuser.name) ? { name: newname, url: `/${name}` } : { name: "author", url: "/" };

        const postRates: rateType[] = posts.map((post, index) => {
            const postId = post.id ? String(post.id) : "#";
            const postImg = post.imageUrl ? post.imageUrl : "#";
            const reduce = post.rates.reduce((a, b) => (a + b.rate), 0);
            const avrate = Math.round(reduce / (post.rates.length))

            return {
                id: postId,
                title: post.name,
                name: post.name,
                rate: avrate,
                img: postImg,
                author: authorFound,

            }
        });
        const fileRates: rateType[] = files.map((file, index) => {
            const fileId = file.id ? file.id : "#";
            const fileImg = file.imageUrl ? file.imageUrl : image;
            const reduce = file.rates.reduce((a, b) => (a + b.rate), 0);
            const avrate = Math.round(reduce / (file.rates.length));
            const userImg = (getuser && getuser.image) ? getuser.image : image;

            return {
                id: fileId,
                title: file.title,
                name: file.name,
                rate: avrate,
                img: fileImg,
                author: authorFound,

            }
        });



        // optionally access and extend (rather than replace) parent metadata
        const previousImages = (await parent)?.openGraph?.images || []
        const prevDesc = (await parent).openGraph?.description;
        const keywords = (await parent).keywords || [];
        const authors = (await parent).authors || [];
        const referrer = (await parent).referrer;
        const creator: string | null = (await parent).creator;
        const postNames: string[] = postRates.map(rate => (rate.name));
        const fileNames: string[] = fileRates.map(rate => (rate.name));
        const names: string[] = fileNames.concat(postNames);
        const titles: string = fileRates.map(rate => (rate.title)).join(",");
        const fileImages: string[] = fileRates.map(rate => (rate.img));
        const postImages: string[] = postRates.map(rate => (rate.img));
        const totImages = fileImages.concat(postImages);
        const getAuths = fileRates.map(auth => (auth.author))
        const desc = titles ? `${titles} posts for you` : `all posts for you`;
        const userUrl = `/${name}`
        const newImages = previousImages.concat(totImages);
        const newKwds = keywords.concat(names);
        const newAuths = authors.concat(getAuths);
        const newCreator = `${getuser.name && NameSep(getuser.name)},${creator}`;

        return {
            title: `${NameSep(name)}'s Page`,
            description: `${desc}, ${prevDesc}`,
            keywords: newKwds,
            authors: newAuths,
            creator: newCreator,
            referrer: referrer,

            openGraph: {
                images: [userImage, ...newImages],
                description: `${desc}, ${prevDesc}`,
                url: userUrl,
            },
        }
    }
}
