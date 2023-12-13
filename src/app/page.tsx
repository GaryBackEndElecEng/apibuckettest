
import Link from "next/link";
import React from 'react';
import styles from "@component/home/home.module.css";
import { getErrorMessage } from "@/lib/errorBoundaries";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { redirect } from 'next/navigation';
import Redirect from "@component/comp/Redirect";
import { userType } from "@/lib/Types";
import UserCard from "@component/home/UserCard";
import { notFound } from "next/navigation";
import HomeHeader from "@component/home/HomeHeader";
import authOptions from "@lib/authOptions";
import { getServerSession } from "next-auth";
import { Metadata, ResolvingMetadata } from "next";

const url = process.env.BUCKET_URL as string;
const Bucket = process.env.BUCKET_NAME as string;
const region = process.env.BUCKET_REGION as string;
const accessKeyId = process.env.SDK_ACCESS_KEY as string;
const secretAccessKey = process.env.SDK_ACCESS_SECRET as string;
const s3 = new S3Client({

  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
})

const prisma = new PrismaClient();


export default async function Home() {
  const session = await getServerSession(authOptions);
  const users = await getUsers();
  const isLoggedIn: boolean = session ? true : false;
  return (
    <React.Fragment>
      <HomeHeader isLoggedIn={isLoggedIn} />
      <main className={styles.homeMainPage}>

        <div className={styles.homeUserGrid}>
          {
            users && users.map((user, index) => (
              <div key={index} className={styles.homeGridElement}>
                <UserCard user={user as userType} />
              </div>
            ))
          }
        </div>


      </main>
    </React.Fragment>
  )
}
export async function generateStaticParams() {
  const users = await getUsers();
  return users?.map(user => ({ name: user.name }))
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    if (users) {
      let tempUsers = users as unknown as userType[];
      const retUsers = tempUsers.map((user) => {
        if (user.imgKey) {
          user.image = `${url}/${user.imgKey}`;
        }
        return user;
      })

      return retUsers
    }
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(`${message}@home`)
  }
}

type rateType = { id: string, title: string, name: string, rate: number, img: string, author: { name: string, url: string } }

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata | undefined> {

  const authors_: userType[] = await getUsers() as unknown[] as userType[]
  if (authors_ && authors_.length > 0) {
    const image = "/images/logo_512.png";

    // optionally access and extend (rather than replace) parent metadata
    const referrer = (await parent).referrer;
    const previousImages = (await parent)?.openGraph?.images || []
    const prevDesc = (await parent).openGraph?.description;
    const keywords = (await parent).keywords || [];
    const authors = (await parent).authors || [];
    const names: string = authors_.map(user => (user.name)).join(",")
    const kwds: string[] = authors_.map(user => (user.name as string));
    const images: string[] = authors_.map(user => (user.image as string));
    const getAuths = authors_.map(user => ({ name: user.name, url: `/${user.name}` }));
    const desc = names ? `${names} bloggers for you` : `all posts for you`;
    const newImages = previousImages.concat(images);
    const newKwds = keywords.concat(kwds);
    const newAuths = authors.concat(getAuths)
    return {
      description: `${desc}, ${prevDesc}`,
      keywords: newKwds,
      authors: newAuths,
      referrer,

      openGraph: {
        images: [image, ...newImages],
        description: `${desc}, ${prevDesc}`,
        url: "/",
      },
    }
  }
}





