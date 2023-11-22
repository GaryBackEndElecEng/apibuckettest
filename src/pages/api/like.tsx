import { likeType, likeArr } from "@/lib/Types";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@lib/errorBoundaries";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



export async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const item = JSON.parse(req.body);
        const like: likeType = item as likeType;
        if (like.fileId) {
            try {
                const checkFile = await prisma.like.findFirst({
                    where: {
                        name: like.name,
                    }
                });
                if (checkFile) {
                    const update = await prisma.like.update({
                        where: {
                            id: checkFile.id
                        },
                        data: {
                            count: checkFile.count,
                            fileId: checkFile.fileId,
                            postId: checkFile.postId
                        }
                    });
                    res.status(200).json(update)
                } else {
                    const createLike = await prisma.like.create({
                        data: {
                            name: like.name,
                            count: 1,
                            fileId: like.fileId,
                            postId: like.postId
                        }
                    });
                    res.status(200).json(createLike)
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
            const likes = await prisma.like.findMany();
            res.status(200).json(likes)
        } catch (error) {
            console.error(`${getErrorMessage(error)}:@like`)
        }
    }
}