"use client"
import React from 'react';
import styles from "@dashboard/createblog/createablog.module.css";
import type { userType, fileType, postType } from "@lib/Types";
import CreateUser from "@/components/dashboard/UpdateUser";
import { useBlogContext } from '@/components/context/BlogContextProvider';
import CreateFile from "@component/dashboard/createblog/CreateFile";
import { TextField } from '@mui/material';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { useGeneralContext } from '@/components/context/GeneralContextProvider';
import { Session } from 'next-auth';

type fetchType = {
    file: fileType,
    message: string,
}

export default function CreateBlog({ session }: { session: Session }) {
    const { file_, setFile_, setBlogMsg } = useBlogContext();
    const { user } = useGeneralContext()
    const [isCreated, setIsCreated] = React.useState<boolean>(false)
    React.useEffect(() => {
        if (user && user.id) {
            let tempFile: fileType = {} as fileType
            setFile_({ ...tempFile, userId: user.id })
        }
    }, [user, setFile_]);



    const handleNewFile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log("FILE_", file_)//works
        if (file_ && file_.name && user && file_.userId) {

            try {
                const res = await fetch("/api/file", {
                    method: "POST",
                    body: JSON.stringify(file_)
                });
                const body: fetchType = await res.json()
                if (res.ok) {
                    setFile_(body.file);
                    setBlogMsg({ loaded: true, msg: body.message });
                    setIsCreated(true);
                } else if (res.status > 200 && res.status < 500) {
                    setBlogMsg({ loaded: false, msg: body.message })
                }
            } catch (error) {
                const message = getErrorMessage(error)
                setBlogMsg({ loaded: false, msg: message })
                console.error(`${message}@file`)

            }
        }

    }

    return (
        <div className={styles.mainCreatablog}>
            <div className={isCreated ? styles.hideFileName : styles.showFileName} >
                {file_ &&
                    <form className={styles.creatablogForm}
                        onSubmit={(e) => handleNewFile(e)}
                    >
                        <TextField
                            fullWidth={false}
                            helperText={"File Name"}
                            id={"fileName"}
                            label={"File Name"}
                            multiline={false}
                            name={"fileName"}
                            placeholder="please enter a file name"
                            required
                            size={"medium"}
                            type="text"
                            variant="filled"
                            value={file_ ? file_?.name : "full name"}
                            onChange={(e) => setFile_({ ...file_ as fileType, name: e.target.value.trim() as string })}
                        />
                        <button className={styles.btnSubmit} type="submit">create now</button>
                    </form>
                }
            </div>

            {user && isCreated && file_ && <CreateFile user={user} file={file_} />}

        </div>
    )
}