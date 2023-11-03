import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from "uuid";

const Bucket = process.env.BUCKET_NAME as string
const region = process.env.BUCKET_REGION as string
const accessKeyId = process.env.SDK_ACCESS_KEY as string
const secretAccessKey = process.env.SDK_ACCESS_SECRET as string
const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: "v4"
})

export default async function handleTest(req: NextApiRequest, res: NextApiResponse) {
    const fileType: string = req.query.fileType as string;
    const ext = fileType.split("/")[1]
    const Key = `${uuidv4().split("-").slice(0, 1).join()}-test.${ext}`;
    console.log("fileType", fileType, ext,)
    const s3Params = {
        Bucket,
        Key,
        Expires: 60,
        ContentType: `image/${ext}`
    }
    // console.log("fileType", fileType, ext, s3Params)
    const uploadUrl = await s3.getSignedUrl("putObject", s3Params);
    res.status(200).json({
        uploadUrl,
        Key
    })
}