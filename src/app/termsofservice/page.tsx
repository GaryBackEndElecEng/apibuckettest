import React from 'react';
import styles from "./service.module.css";
import { PrismaClient } from "@prisma/client";
import { getErrorMessage } from '@/lib/errorBoundaries';
import Service from "./Service";
import { generalInfoType } from '@/lib/Types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "terms of service",
    description: " ablogroom.com terms of service page",
    keywords: ["ablogroom's terms of service page", "free blogs and comments"]

}

const prisma = new PrismaClient();

export default async function page() {
    const services = await getService() as generalInfoType[];
    const intro: generalInfoType | undefined = services.find(serv => (serv.name === "intro"));
    return (
        <div className={styles.mainService}>
            <h1>TERMS OF SERVICE</h1>
            {intro && <Service service={intro} />}
            {services && services.map((service, index) => {
                if (service.name !== "intro") {
                    return (
                        <React.Fragment key={index}>
                            <Service service={service} />
                        </React.Fragment>
                    )
                }
            })}
        </div>
    )
}

export async function getService() {
    try {
        const services = await prisma.generalInfo.findMany({
            where: {
                category: "service"
            }
        });
        return services
    } catch (error) {
        const msg = getErrorMessage(error);
        console.error(`${msg}@privacy@page@generalInfo`)
    }
}
