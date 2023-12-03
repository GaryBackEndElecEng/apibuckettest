import { NextApiRequest, NextApiResponse } from "next";
import type { userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client/edge';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from "uuid";
// export const config = { runtime: 'experimental-edge' }

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {

        try {
            const users = await prisma.user.findMany();
            if (users) {
                let temUsers = insertUsers(users as userType[]);

                res.status(200).json(temUsers)
            } else {
                res.status(404).json({ message: "no users @users" })
            }
        } catch (error) {
            console.error(new Error("issues @api/user get"))
        } finally {
            await prisma.$disconnect()
        }

    }
}

async function insertUsers(users: userType[]) {
    const getUsers = await Promise.all(
        users.map(async (user) => {
            if (user.imgKey) {
                const params = { Key: user.imgKey, Bucket };
                const command = new GetObjectCommand(params);
                const url = await getSignedUrl(s3, command, { expiresIn: parseInt(expiresIn) });
                if (url) user.image = url;
            }
            user.password = "omit";
            return user;
        })
    );
    return getUsers
}