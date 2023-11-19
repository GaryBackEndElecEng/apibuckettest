"use client";
import React from 'react';
import CreatePost from "@component/dashboard/createPost/CreatePost";
import DashboardContextProvider from "@context/DashBoardContextProvider"


export default function MainCreatePost() {
    return (
        <DashboardContextProvider>
            <CreatePost />
        </DashboardContextProvider>
    )
}
