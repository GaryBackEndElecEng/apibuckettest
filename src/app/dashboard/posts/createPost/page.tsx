import React from 'react';
import MainCreatePost from "@component/dashboard/createPost/MainCreatePost";
import { Session, getServerSession } from 'next-auth';
import authOptions from "@lib/authOptions";
import Login from "@component/comp/Login";

export default async function page() {
    const session = await getServerSession(authOptions);

    if (session) {

        return (
            <MainCreatePost session={session} />
        )
    } else {
        return (
            <Login />
        )
    }
}
