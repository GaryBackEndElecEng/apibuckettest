import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import type { generalInfoType } from '@/lib/Types';
import { getErrorMessage } from "@lib/errorBoundaries";
const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const genInfo: generalInfoType | undefined = req.body;
        if (genInfo) {
            try {
                const GenInfo = await prisma.generalInfo.create({
                    data: {
                        category: genInfo.category,
                        name: genInfo.name,
                        url: genInfo.url,
                        desc: genInfo.desc
                    }
                });
                res.status(200).json(GenInfo)
            } catch (error) {
                console.error(`@geninfo: ${getErrorMessage(error)}`)
            } finally {
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ message: "bad request, no general info@ geninfo" })
        }
    }
    if (req.method === "GET") {

        try {
            const GenInfo = await prisma.generalInfo.findMany();
            res.status(200).json(GenInfo)

        } catch (error) {
            console.error(`@geninfo: ${getErrorMessage(error)}`)
        } finally {
            await prisma.$disconnect()
        }
    }
}
