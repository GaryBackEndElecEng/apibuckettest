import React from 'react';
import { PrismaClient } from "@prisma/client";
import ConfirmedUnsub from "./ConfirmedUnsub"

const prisma = new PrismaClient();


export async function generatStaticParams() {
    const contacts = await getContacts();
    return contacts.map(contact => ({ email: contact.email }))
}

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const email = searchParams.email as string
    return (
        <div className="lg:container mx-auto">
            <h3 className="text-center my-2"> Your {email} will be removed from our databse.</h3>
            <ConfirmedUnsub email={email} />

        </div>
    )
}

export async function getContacts() {
    const contacts = await prisma.contact.findMany();
    await prisma.$disconnect();
    return contacts
}
