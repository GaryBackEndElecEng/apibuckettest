import { postType, userType } from '@/lib/Types'
import React from 'react';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from "@/lib/errorBoundaries";
import styles from "@component/userpage/userpage.module.css";
import { redirect } from 'next/navigation';
import Redirect from "@component/comp/Redirect";
import UserPage from "@component/userpage/UserPage";

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



type userPageType = {
    user: userType
}
export default async function MainUserPage({ user }: userPageType) {
    const posts: postType[] | undefined = await getUserPosts(user) as postType[]
    return (
        <div className={styles.mainUserpage}>
            <UserPage user={user} files={user.files} posts={posts} />
        </div>
    )
}

export async function getUserPosts(user: userType) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                userId: user.id
            },
            include: {
                rates: true,
            }
        });
        if (posts) {
            let tempPosts = posts;
            const retPosts = await Promise.all(
                tempPosts.map(async (post) => {
                    if (post.s3Key) {
                        const params = {
                            Key: post.s3Key,
                            Bucket
                        }
                        const command = new GetObjectCommand(params);
                        post.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
                    }
                    return post
                })
            );
            return retPosts
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error(`${message}@masterUserPage@getposts`)
    }
}


