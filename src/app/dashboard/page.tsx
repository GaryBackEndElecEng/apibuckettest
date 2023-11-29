
import React from 'react'
import MainDash from "@dashboard/MainDash";
import authOptions from "@lib/authOptions";
import { getServerSession } from 'next-auth';
import DashSignup from "@component/dashboard/DashSignup";


export default async function page() {
    const session = await getServerSession(authOptions);
    if (session) {
        return (


            <MainDash session={session} />

        )
    } else {
        return (
            <DashSignup />
        )

    }
}
