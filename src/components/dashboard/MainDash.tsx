"use client";
import React from 'react';
import Dashboard from "@dashboard/DashBoard";
import GeneralContextProvider from '@context/GeneralContextProvider';

export default function MainDash() {
    return (
        <GeneralContextProvider>
            <Dashboard />
        </GeneralContextProvider>
    )
}
