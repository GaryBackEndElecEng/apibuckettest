import { NextApiRequest, NextApiResponse } from "next";
import type { fileType, inputType, genContactType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from "@/lib/errorBoundaries";
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
    // console.log("INPUT@PUT", req.body)
    if (req.method === "POST") {
        const genContact = req.body;
        const contact = JSON.parse(genContact) as genContactType
        try {
            const newContact = await prisma.genContact.create({
                data: {
                    email: contact.email,
                    subject: contact.subject,
                    content: contact.content
                }
            });

            return res.status(200).json({ contact: newContact, message: "Thank you" })
        } catch (error) {
            const message = getErrorMessage(error)
            console.error(new Error(`server: ${message} issues@gencontact`))
        } finally {
            await prisma.$disconnect()
        }
    }

    if (req.method === "GET") {
        const email = req.query.email as string;
        if (email) {
            try {
                const genCont = await prisma.genContact.findFirst({
                    where: {
                        email: email as string,
                    }
                });
                return res.status(200).json({ contact: genCont, message: "retrieved" })
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(new Error("server issues@api/file"))

            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ message: "no email" })
        }
    }
    if (req.method === "DELETE") {
        const genId = req.query.genId as string;
        if (genId) {
            try {
                const genCont = await prisma.genContact.delete({
                    where: {
                        id: parseInt(genId)
                    }
                });
                if (genCont) {

                    return res.status(200).json({ contact: genCont, message: "deleted" })
                }
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(`${message}@gencontact@delete`)
            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ input: null, message: "missing contactkey" })
        }
    }
}