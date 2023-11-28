import { fileLikeType, likeArr } from "@/lib/Types";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@lib/errorBoundaries";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const item = JSON.parse(req.body);
        const like: fileLikeType = item as fileLikeType;
        if (like) {
            try {
                const checkFile = await prisma.blogLike.findFirst({
                    where: {
                        name: like.name,
                    }
                });
                if (checkFile) {
                    const update = await prisma.blogLike.update({
                        where: {
                            id: checkFile.id
                        },
                        data: {
                            count: checkFile.count,
                            fileId: checkFile.fileId
                        }
                    });
                    res.status(200).json({ like: update, message: "updated" })
                } else {
                    const createLike = await prisma.blogLike.create({
                        data: {
                            name: like.name,
                            count: 1,
                            fileId: like.fileId
                        }
                    });
                    return res.status(200).json({ like: createLike, message: "created" })
                }
            } catch (error) {
                console.error(`${getErrorMessage(error)}:@like`)
            } finally {
                await prisma.$disconnect()
            }
        }

    }
    if (req.method === "GET") {
        try {
            const likes = await prisma.postLike.findMany();
            return res.status(200).json({ likes: likes, message: "retieved" })
        } catch (error) {
            console.error(`${getErrorMessage(error)}:@like`)
        }
    }
}