
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
// export const config = { runtime: 'experimental-edge' }

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

export async function POST(req: NextRequest) {
    const formdata = await req.formData() as FormData;

    const file: File = formdata.get("file") as File;
    const Key: string = formdata.get("Key") as string;
    if (!file) return NextResponse.json({ error: "no file" })
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const params = {
        Bucket,
        Key,
        Body: buffer,
    }
    const get_params = {
        Bucket,
        Key,
    }
    const command = new PutObjectCommand(params);
    const result = await s3.send(command);

    if (result) {

        return new Response("ok", { status: 200 })
    }
}