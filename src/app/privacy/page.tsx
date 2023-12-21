import React from 'react'
import styles from "./privacy.module.css";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { PrismaClient } from '@prisma/client';
import type { generalInfoType } from "@lib/Types";
import Policy from "./Policy";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy",
    description: " ablogroom.com privacy page",
    keywords: ["ablogroom's privacy page", "free blogs and comments"]

}

const prisma = new PrismaClient();

export default async function page() {
    const policies = await getPrivacy() as generalInfoType[];
    const intro: generalInfoType | undefined = policies.find(pol => (pol.name === "intro"));
    return (
        <div className={styles.main} >
            <h1>PRIVACY POLICY</h1>
            {intro && <Policy policy={intro} />}
            <h2> {"supplemental policy".toUpperCase()}</h2>
            {policies && policies.map((policy, index) => {
                if (policy.name !== "intro") {
                    return (
                        <React.Fragment key={index}>
                            <Policy policy={policy} />
                        </React.Fragment>
                    )
                }

            })}
        </div>
    )
}

export async function getPrivacy() {
    try {
        const policys = await prisma.generalInfo.findMany({
            where: {
                category: "policy"
            }
        });
        return policys
    } catch (error) {
        const msg = getErrorMessage(error);
        console.error(`${msg}@privacy@page@generalInfo`)
    }
}
