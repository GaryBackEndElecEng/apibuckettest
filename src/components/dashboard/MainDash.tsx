"use client";
import React from 'react';
import Dashboard_ from "@/components/dashboard/DashBoard_"


import type { Session } from 'next-auth';

export default function MainDash({ session }: { session: Session | null }) {
    return (

        // <Dashboard_ContextProvider>
        <Dashboard_ session={session} />


    )
}
