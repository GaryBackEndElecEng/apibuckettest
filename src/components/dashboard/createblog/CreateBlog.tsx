"use client"
import React from 'react';
import styles from "@dashboard/createblog/createablog.module.css";
import type { userType, fileType, postType } from "@lib/Types";
import CreateUser from "@/components/dashboard/createblog/CreateUser";


export default function CreateBlog() {


    const mainStyle = " mx-auto px-2 py-2";
    const form = "flex flex-col gap-3 mx-auto";

    return (
        <div className={mainStyle}>
            <CreateUser />
        </div>
    )
}