import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import type { pageHitType } from '@/lib/Types';
import { getErrorMessage } from "@lib/errorBoundaries";
const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {

        const pagehit: pageHitType | undefined = JSON.parse(req.body);

        if (pagehit) {
            try {
                const test = await prisma.pageHit.findFirst({
                    where: {
                        page: pagehit.page
                    },

                });
                await prisma.pageHit.upsert({
                    where: {
                        page: pagehit.page
                    },
                    create: {
                        page: pagehit.page,
                        count: 1,
                        name: pagehit.name
                    },
                    update: {
                        count: test ? test.count + 1 : 1,
                        name: pagehit.name
                    }
                })
                res.status(200).json({ message: "update" })

            } catch (error) {
                const message = getErrorMessage(error);
                console.error(`@pagehit: ${message}`);
                res.status(404).json({ message: message })
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
            res.status(200).json({ pageHits: pageHits, message: "recieved pgHits" });

        } catch (error) {
            console.error(`@pagehit: ${getErrorMessage(error)}`)
        } finally {
            await prisma.$disconnect()
        }
    }
}