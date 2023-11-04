import { NextApiRequest, NextApiResponse } from "next";
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

export async function getMedia(key: string) {
    console.log("key", key)

    const get_params = {
        Bucket,
        Key: key,
    }


    const commGet = new GetObjectCommand(get_params);
    const imgUrl = await getSignedUrl(s3, commGet, { expiresIn: 3600 });
    return { imgUrl, Key: key }

}