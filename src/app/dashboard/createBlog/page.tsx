import React from 'react';
import type { userType, fileType, postType } from "@lib/Types";
import CreateBlog from "@/components/dashboard/createblog/CreateBlog";

export default function page() {
    const mainStyle = "lg:container mx-auto px-2 py-2";


    return (
        <div className={mainStyle}>
            <CreateBlog />
        </div>
    )
}
