import { NextRequest, NextResponse } from 'next/server';
import { NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import { genHash } from "@lib/ultils";
import type { userType } from "@lib/Types";
import { getErrorMessage } from '@/lib/errorBoundaries';
const prisma = new PrismaClient();


export async function POST(
    req: NextRequest,
    res: NextApiResponse
) {

    const formdata = await req.formData();
    if (formdata) {
        const name: string | null = formdata.get("name") as string;
        const email: string | null = formdata.get("email") as string;
        const password = formdata.get("password");
        const hashPswd: string | undefined = await genHash(password as string);
        const imgKey: string | null = formdata.get("imgKey") as string


        try {
            const check = await prisma.user.findUnique({
                where: {
                    email: email as string
                }

            });
            if (check) {
                const updateUser = await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        name: name ? name.trim() : (check.name as string).trim(),
                        password: hashPswd ? hashPswd : check.password,
                        imgKey: imgKey ? imgKey : check.imgKey
                    }
                })
                return NextResponse.json({ message: "update", status: 200, user: `${JSON.stringify(updateUser)}` });
            } else {
                const user = await prisma.user.create({
                    data: {
                        name: name ? name.trim() : null,
                        email: email,
                        password: hashPswd,
                        imgKey: imgKey ? imgKey : null
                    }
                });
                return NextResponse.json({ status: 200, user: `${JSON.stringify(user)}`, message: "created" })
            }
        } catch (error) {
            const message = getErrorMessage(error)
            return NextResponse.json({ status: 500, message: `server issue@register: ${message}`, user: "" });
        } finally {
            await prisma.$disconnect()
        }

    } else {
        return NextResponse.json({ status: 400, message: "bad request@register- no data recieved", user: "" })
    }

}