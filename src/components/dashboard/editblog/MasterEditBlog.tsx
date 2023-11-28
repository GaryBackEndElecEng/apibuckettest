"use client"
import React from 'react'
import EditFile from "./EditFile";
import { Session } from 'next-auth';
import { useGeneralContext } from '@/components/context/GeneralContextProvider';
import { useBlogContext } from '@/components/context/BlogContextProvider';
import { useSearchParams } from "next/navigation";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { fileType, userType } from '@/lib/Types';

type mastertype = {
    user: userType,
    file: fileType | undefined
}
type emailFetchType = {
    user: userType,
    message: string
}
type userFetchType = {
    file: fileType,
    message: string
}
export default function MasterEditBlog({ user, file }: mastertype) {
    const { setUser } = useGeneralContext();
    const { file_, setFile_, setBlogMsg, } = useBlogContext();

    React.useEffect(() => {
        if (file) {
            setFile_(file);
            setBlogMsg({ loaded: true, msg: "recieved file" })
        } else {
            setBlogMsg({ loaded: false, msg: "No file" })
        }
        setUser(user);

    }, [setFile_, setUser, user, file, setBlogMsg]);



    return (
        <div>
            <EditFile user={user} file={file_} />
        </div>
    )
}
