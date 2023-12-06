import { NextApiRequest, NextApiResponse } from "next";
import type { contactType, userType } from "@lib/Types";
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getErrorMessage } from "@/lib/errorBoundaries";
// export const config = { runtime: 'experimental-edge' }

type sendEmailType = {
    user: userType,
    contact: contactType
}
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
        const Contact = req.body;
        const contact = JSON.parse(Contact) as contactType
        if (contact.email && contact.userId) {
            try {
                const newContact = await prisma.contact.upsert({
                    where: {
                        email: contact.email
                    },
                    create: {
                        email: contact.email,
                        subject: contact.subject,
                        content: contact.content,
                        userId: contact.userId
                    },
                    update: {
                        subject: contact.subject,
                        content: contact.content,
                    }
                });

                return res.status(200).json({ contact: newContact, message: "Thank you for your reply." })
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(new Error(`server: ${message} issues@contact`))
            } finally {
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ contact: null, message: "no email or userId" })
        }
    }

    if (req.method === "GET") {
        const email = req.query.email as string;
        if (email) {
            try {
                const genCont = await prisma.contact.findFirst({
                    where: {
                        email: email as string,
                    }
                });
                return res.status(200).json({ contact: genCont, message: "retrieved" })
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(new Error(`server issues:${message} @contact@get`))

            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ message: "no email" })
        }
    }
    if (req.method === "DELETE") {
        const contactId = req.query.contactId as string;
        if (contactId) {
            try {
                const genCont = await prisma.genContact.delete({
                    where: {
                        id: parseInt(contactId)
                    }
                });
                if (genCont) {

                    return res.status(200).json({ contact: genCont, message: "deleted" })
                }
            } catch (error) {
                const message = getErrorMessage(error)
                console.error(`${message}@contact@delete`)
            } finally {
                await prisma.$disconnect()
            }
        } else {
            return res.status(404).json({ input: null, message: "missing contactID" })
        }
    }
}

export async function sendEmail(contact: contactType) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: contact.userId
            }
        });
        const sendNodeEmail: sendEmailType = { user: user as unknown as userType, contact: contact }
        return sendNodeEmail
    } catch (error) {
        const msg = getErrorMessage(error);
        console.error(`${msg}@contact@sendEmail`)
    } finally {
        await prisma.$disconnect()
    }
}