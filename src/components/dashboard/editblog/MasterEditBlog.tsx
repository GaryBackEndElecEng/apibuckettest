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
    session: Session | null
}
type emailFetchType = {
    user: userType,
    message: string
}
type userFetchType = {
    file: fileType,
    message: string
}
export default function MasterEditBlog({ session }: mastertype) {
    const { user, setUser } = useGeneralContext();
    const searchParams = useSearchParams();
    const { file_, setFile_, setBlogMsg, blogMsg } = useBlogContext();
    const fileId = searchParams?.get("fileId") as string;

    React.useEffect(() => {
        if (session && session.user && session.user.email) {
            const email = session.user?.email
            const getuser = async () => {
                try {
                    const res = await fetch(`/api/useremail?email=${email}`);
                    const body = await res.json() as emailFetchType
                    if (res.ok) {
                        setUser(body.user);
                        setBlogMsg({ loaded: true, msg: body.message });
                    } else {
                        setBlogMsg({ loaded: false, msg: body.message });
                    }
                } catch (error) {
                    const message = getErrorMessage(error);
                    console.error(`${message}@useremail`)
                    setBlogMsg({ loaded: true, msg: message });
                }
            }
            getuser()
        }

    }, [session, setBlogMsg, setUser]);

    React.useEffect(() => {
        if (user && fileId) {
            const getFile = async () => {
                try {
                    const res = await fetch(`/api/file?fileId=${fileId}`);
                    const body: userFetchType = await res.json();
                    if (res.ok) {
                        setFile_(body.file);
                        setBlogMsg({ loaded: true, msg: body.message });
                    } else if (res.status > 200 && res.status < 500) {
                        setBlogMsg({ loaded: false, msg: body.message })
                    }

                } catch (error) {
                    const message = getErrorMessage(error);
                    console.error(`${message}@file`)
                    setBlogMsg({ loaded: false, msg: message })
                }
            }
            getFile();
        }
    }, [user, fileId, setBlogMsg, setFile_]);

    return (
        <div>
            <EditFile user={user} file={file_} />
        </div>
    )
}
