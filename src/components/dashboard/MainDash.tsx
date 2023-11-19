"use client";
import React from 'react';
import Dashboard from "@dashboard/DashBoard";
import GeneralContextProvider from '@context/GeneralContextProvider';
import type { Session } from 'next-auth';

export default function MainDash({ session }: { session: Session | null }) {
    return (
        <GeneralContextProvider>
            <Dashboard session={session} />
        </GeneralContextProvider>
    )
}
