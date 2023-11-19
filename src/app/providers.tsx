"use client"
import React from 'react'
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

type providerType = {
    children?: React.ReactNode
}
const Providers = ({ children }: providerType) => {
    return <SessionProvider>{children}</SessionProvider>
}
export default Providers