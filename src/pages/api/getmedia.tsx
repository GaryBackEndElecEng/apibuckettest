import { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from "uuid";


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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // console.log("REQ.BODY", req.query)
    const Key = req.query.Key as string;
    const get_params = {
        Bucket,
        Key,
    }


    const commGet = new GetObjectCommand(get_params);
    const url = await getSignedUrl(s3, commGet, { expiresIn: parseInt(expiresIn) });
    res.status(200).json({ url, Key })

}