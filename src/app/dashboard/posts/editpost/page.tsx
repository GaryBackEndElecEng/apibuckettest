import React from 'react'
import MainEditPost from "@component/dashboard/editPost/MainEditPost";
import { Session, getServerSession } from 'next-auth';
import authOptions from "@lib/authOptions";
import Login from "@component/comp/Login";

export default async function page() {
    const session = await getServerSession(authOptions);
    if (session) {
        return (
            <MainEditPost />
        )
    } else {
        return (
            <Login />
        )
    }
}
