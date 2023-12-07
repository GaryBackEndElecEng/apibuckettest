import React from 'react';
import { PrismaClient } from "@prisma/client";
import DeleteAcc from "./DeleteAcc"

const prisma = new PrismaClient();


export async function generatStaticParams() {
    const users = await getUsers();
    return users.map(user => ({ email: user.email }))
}

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const email = searchParams.email as string
    return (
        <div className="lg:container mx-auto">
            <h3 className="text-center my-2"> Your {email} will be removed from our databse.</h3>
            <DeleteAcc email={email} />

        </div>
    )
}

export async function getUsers() {
    const users = await prisma.user.findMany();
    await prisma.$disconnect();
    return users
}