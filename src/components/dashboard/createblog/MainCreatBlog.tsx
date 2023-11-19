"use client"
import React from 'react';
import DashboardContextProvider from '@context/DashBoardContextProvider';
import CreateBlog from "@component/dashboard/createblog/CreateBlog"

export default function MainCreatBlog() {
    return (
        <DashboardContextProvider>
            <CreateBlog />
        </DashboardContextProvider>
    )
}
