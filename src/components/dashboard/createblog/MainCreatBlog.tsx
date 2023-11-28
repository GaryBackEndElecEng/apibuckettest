"use client"
import React from 'react';

import CreateBlog from "@component/dashboard/createblog/CreateBlog"
import { Session } from 'next-auth';

export default function MainCreatBlog({ session }: { session: Session }) {
    return (

        <CreateBlog session={session} />

    )
}
