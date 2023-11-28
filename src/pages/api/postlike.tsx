import { likeType, likeArr, postLikeType } from "@/lib/Types";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@lib/errorBoundaries";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const item = JSON.parse(req.body);
        const like: postLikeType = item as postLikeType;

        if (like) {
            try {
                const checkFile = await prisma.postLike.findFirst({
                    where: {
                        name: like.name,
                    }
                });
                if (checkFile) {
                    const update = await prisma.postLike.update({
                        where: {
                            id: checkFile.id
                        },
                        data: {
                            count: checkFile.count,
                            postId: checkFile.postId
                        }
                    });
                    res.status(200).json({ like: update, message: "updated" })
                } else {
                    const createLike = await prisma.postLike.create({
                        data: {
                            name: like.name,
                            count: 1,
                            postId: like.postId
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