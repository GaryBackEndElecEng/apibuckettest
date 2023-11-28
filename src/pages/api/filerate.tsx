import { fileRateType, } from "@/lib/Types";
import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "@lib/errorBoundaries";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const item = JSON.parse(req.body);
        const rate: fileRateType = item as fileRateType;
        if (rate) {
            try {

                const update = await prisma.blogRate.create({
                    data: {
                        rate: rate.rate,
                        fileId: rate.fileId
                    }
                });
                res.status(200).json({ rate: update, message: "updated" })
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
            const rates = await prisma.blogRate.findMany();
            res.status(200).json({ rates: rates, message: "retrieved" })
        } catch (error) {
            console.error(`${getErrorMessage(error)}:@rate`)
        }
    }
}