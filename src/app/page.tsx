import TestPagev3 from "@component/TestPagev3"
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { fileType } from "@/lib/Types";
import GetFiles from "@component/blog/GetFiles";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from "uuid";


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
  const files: fileType[] = await getServerSide();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col my-3 px-3 rounded-full px-3 bg-slate-800 text-white shadow shadow-orange-800">
        <Link href={"/createBlog"}>CreateBlog</Link>
      </div>
      <main className="flex flex-col lg:container mx-auto">
        <GetFiles files={files} />
      </main>
    </main>
  )
}

export const getServerSide = async (): Promise<fileType[]> => {
  const files: fileType[] = await prisma.file.findMany();
  const newFiles = await Promise.all(
    files.map(async (file) => {
      if (file.imageKey) {
        const params = { Key: file.imageKey, Bucket };
        const command = new GetObjectCommand(params);
        file.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      }
      return file
    })
  );

  return newFiles
}



