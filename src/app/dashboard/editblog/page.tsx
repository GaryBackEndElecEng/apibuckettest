"use client";
import React from 'react';
import { useSearchParams } from "next/navigation";
import { useBlogContext } from '@/components/context/BlogContextProvider';
import styles from "@dashboard/editblog/editblog.module.css";
import EditFile from "@dashboard/editblog/EditFile";
import { useGeneralContext } from '@/components/context/GeneralContextProvider';
import { fileType, userType } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { useSession } from "next-auth/react";
import Login from "@component/comp/Login";

type userFetchType = {
    files: fileType[],
    message: string
}
type emailFetchType = {
    user: userType,
    message: string
}

export default function Page() {
    const { data, status } = useSession();
    const searchParams = useSearchParams();
    const { file_, setFile_, userBlogs, setUserBlogs, setBlogMsg, blogMsg } = useBlogContext();
    const { user, setUser } = useGeneralContext();
    const fileId = searchParams?.get("fileId") as string;

    React.useEffect(() => {
        if (status === "authenticated" && data && data.user && data.user.email && !user) {
            const getuser = async () => {
                const email = data.user?.email;
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
    }, [status, data, setBlogMsg, setUser]);

    React.useEffect(() => {
        if (!(userBlogs && userBlogs.length > 0) && user) {
            const getUserBlogs = async () => {
                try {
                    const res = await fetch(`/api/userblogs?userId=${user.id}`);
                    const body: userFetchType = await res.json();
                    if (res.ok) {
                        setUserBlogs(body.files);
                        setBlogMsg({ loaded: true, msg: body.message });
                    } else if (res.status > 200 && res.status < 500) {
                        setBlogMsg({ loaded: false, msg: body.message })
                    }

                } catch (error) {
                    const message = getErrorMessage(error);
                    setBlogMsg({ loaded: false, msg: message })
                }
            }
            getUserBlogs();
        }
    }, [userBlogs, setUserBlogs, setBlogMsg, user]);

    React.useEffect(() => {
        if (user && fileId && userBlogs) {
            const file = userBlogs.find(blog => (blog.id === fileId));
            if (file) {
                setFile_(file);
            }
        }
    }, [user, setFile_, fileId, userBlogs]);

    if (status === "authenticated") {
        return (
            <div className={styles.mainEditBlog}>
                {user && file_ && <EditFile file={file_} user={user} />}
            </div>
        )
    } else {
        return (
            <Login />
        )
    }
}
