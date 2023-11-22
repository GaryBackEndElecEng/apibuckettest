import { rateType, } from "@/lib/Types";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@lib/errorBoundaries";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



export async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const item = JSON.parse(req.body);
        const rate: rateType = item as rateType;
        if (rate) {
            try {

                const update = await prisma.rate.create({
                    data: {
                        rate: rate.rate,
                        fileId: rate.fileId,
                        postId: rate.postId
                    }
                });
                res.status(200).json(update)
            } catch (error) {
                console.error(`${getErrorMessage(error)}:@rate`)
            } finally {
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ message: "bad request- no data@rate" })
        }

    }
    if (req.method === "GET") {
        try {
            const rates = await prisma.rate.findMany();
            res.status(200).json(rates)
        } catch (error) {
            console.error(`${getErrorMessage(error)}:@rate`)
        }
    }
}