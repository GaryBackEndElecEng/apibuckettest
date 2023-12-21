import React from 'react';
import { PrismaClient } from "@prisma/client";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { hashKey, hashComp } from "@lib/ultils";
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import styles from "./remove.module.css";
import Login from "@component/comp/Login";
import PleaseContact from "./PleaseContact";
import AccRemoved from "./AccRemoved";
import { userType } from '@/lib/Types';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "remove user account",
    description: " ablogroom.com remove account page",
    keywords: ["ablogroom's remove account page", "free blogs and comments"],
    openGraph: {
        title: "a Blog Room",
        description: 'Generated by www.masterconnect.ca, blogs for you',
        url: "https://www.ablogroom.com/contactUs",
        siteName: "a Blog Room",
        images: [
            {
                url: "/images/happyFamily.png",
                width: 600,
                height: 800
            },

        ],
        locale: "en-CA",
        type: "website"

    },
}

const prisma = new PrismaClient();

export default async function page() {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
        const email = session.user.email;
        const accDeleted: userType | undefined = await deleteAccount(email) as userType;

        if (accDeleted) {
            return (
                <div className={styles.mainRemove}>
                    <AccRemoved user={accDeleted} />
                </div>
            )
        } else {
            return (
                <div className={styles.mainRemove}>

                    <PleaseContact />
                </div>
            )
        }
    } else {
        return (
            <div className={styles.mainRemove}>

                <Login />
            </div>
        )
    }
}



export async function deleteAccount(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user) {
            return user as userType
        }
    } catch (error) {
        const msg = getErrorMessage(error);
        console.error(`${msg}@removeAccount@deleteAccount`)
    } finally {
        await prisma.$disconnect();
    }
}
