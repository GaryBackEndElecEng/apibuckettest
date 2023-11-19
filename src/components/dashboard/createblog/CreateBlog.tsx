"use client"
import React from 'react';
import styles from "@dashboard/createblog/createablog.module.css";
import type { userType, fileType, postType } from "@lib/Types";
import CreateUser from "@/components/dashboard/UpdateUser";
import DashboardContextProvider, { DashboardContext } from '@/components/context/DashBoardContextProvider';
import CreateFile from "@component/dashboard/createblog/CreateFile";


export default function CreateBlog() {
    const { file, setFile, user } = React.useContext(DashboardContext)

    const mainStyle = " mx-auto px-2 py-2";
    const form = "flex flex-col gap-3 mx-auto";

    return (
        <div className={mainStyle}>

            {user && <CreateFile userId={user.id} />}

        </div>
    )
}