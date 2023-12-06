
import Link from "next/link";
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


export default async function Home() {
  const users = await getUsers();
  return (
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
  )
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    if (users) {
      let tempUsers = users;
      const retUsers = await Promise.all(
        tempUsers.map(async (user) => {
          if (user.imgKey) {
            const params = {
              Key: user.imgKey,
              Bucket
            }
            const command = new GetObjectCommand(params);
            user.image = await getSignedUrl(s3, command, { expiresIn: 3600 });
          }
          return user;
        })
      );
      return retUsers
    }
  } catch (error) {
    const message = getErrorMessage(error);
    console.error(`${message}@home`)
  }
}





