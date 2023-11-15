import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import type { pageHitType } from '@/lib/Types';
import { getErrorMessage } from "@lib/errorBoundaries";
const prisma = new PrismaClient();


export async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const pagehit: pageHitType | undefined = req.body;
        if (pagehit) {
            try {
                const GenInfo = await prisma.pageHit.upsert({
                    where: {
                        page: pagehit.page
                    },
                    create: {
                        page: pagehit.page,
                        name: pagehit.name

                    },
                    update: {
                        name: pagehit.name
                    }
                });
                res.status(200).json(GenInfo)
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
            res.status(200).json(pageHits)
        } catch (error) {
            console.error(`@pagehit: ${getErrorMessage(error)}`)
        } finally {
            await prisma.$disconnect()
        }
    }
}