import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import type { pageHitType } from '@/lib/Types';
import { getErrorMessage } from "@lib/errorBoundaries";
const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {

        const pagehit: pageHitType | undefined = req.body;
        if (pagehit) {
            try {
                const test = await prisma.pageHit.findUnique({
                    where: {
                        page: pagehit.page
                    }
                });
                if (test) {
                    const GenInfo = await prisma.pageHit.update({
                        where: {
                            page: test.page
                        },
                        data: {
                            name: pagehit.name,
                            count: test.count + 1
                        }
                    });
                    if (GenInfo) {
                        res.status(200).json(GenInfo)
                    }
                } else {
                    const newPage = await prisma.pageHit.create({
                        data: {
                            name: pagehit.name,
                            page: pagehit.page,
                            count: 1
                        }
                    });
                    res.status(200).json(newPage)
                }

            } catch (error) {
                console.error(`@pagehit: ${getErrorMessage(error)}`)
            } finally {
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ message: "bad request, no general info@ pagehit" })
        }
    }
    if (req.method === "GET") {
        try {
            const pageHits = await prisma.pageHit.findMany();
            return res.status(200).json(pageHits)
        } catch (error) {
            console.error(`@pagehit: ${getErrorMessage(error)}`)
        } finally {
            await prisma.$disconnect()
        }
    }
}