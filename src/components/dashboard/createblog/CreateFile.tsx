"use client";
import React from 'react';
import type { fileType, msgType, userType } from '@lib/Types';
import { TextField } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Image from 'next/image';
import { useBlogContext } from '@/components/context/BlogContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import CreateInputs from "@component/dashboard/createblog/CreateInputs";
import Link from 'next/link';
import styles from "@component/dashboard/createblog/createablog.module.css"


type fetchType = {
    file: fileType,
    message: string,
}
type mainCreateFileType = {
    user: userType,
    file: fileType
}
export default function CreateFile({ user, file }: mainCreateFileType) {
    const { setFile_, setBlogMsg, blogMsg, input_s } = useBlogContext();
    const [message, setMessage] = React.useState<msgType>({} as msgType);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [complete, setComplete] = React.useState<boolean>(false);



    const handleFile = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/file", {
                method: "PUT",
                body: JSON.stringify(file)
            });
            const body: fetchType = await res.json();
            if (res.ok) {
                setFile_(body.file);
                setBlogMsg({ loaded: true, msg: body.message });
                setLoaded(true);
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@file`)
            setBlogMsg({ loaded: false, msg: message })
        }


    }

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        if (e.target.files) {
            const file_ = e.target.files[0]
            const formData = new FormData();
            formData.set("file", file_);
            const Key = `${user.name?.trim()}/${file.id}/${uuidv4()}-${file_.name}`;
            formData.set("Key", Key);
            const { data } = await axios.post("/api/media", formData)
            if (data.status === 200) {
                setFile_({ ...file, imageKey: Key });
                setMessage({ loaded: true, msg: "saved" })
            } else {
                setMessage({ loaded: false, msg: "not saved" })
            }

        }

    }

    return (
        <div className={styles.mainCreatablog}>
            {file &&
                <React.Fragment>
                    <form className={styles.fileForm}>

                        <TextField
                            fullWidth={false}
                            helperText={"title"}
                            id={"title"}
                            label={"title"}
                            multiline={false}
                            name={"title"}
                            placeholder="title"
                            required
                            size={"medium"}
                            type="title"
                            variant="filled"
                            value={file ? file?.title : " "}
                            onChange={(e) => setFile_({ ...file, title: e.target.value as string })}
                            style={{ width: "max-content" }}
                        />
                        <div className="flex flex-row my-2 mx-auto gap-2">
                            <label htmlFor="published">published</label>
                            <input
                                id="published"
                                type={"checkbox"}
                                name="published"
                                value={file ? String(file.published) : "false"}
                                onChange={(e) => setFile_({ ...file, published: Boolean(e.target.value) })}
                            />
                        </div>
                        <TextField
                            fullWidth={true}
                            helperText={"bio"}
                            id={"bio"}
                            label={"bio"}
                            multiline={true}
                            minRows={4}
                            name={"bio"}
                            placeholder="bio"
                            required
                            size={"medium"}
                            type="bio"
                            variant="filled"
                            value={file ? file?.content : " "}
                            onChange={(e) => {

                                setFile_({ ...file, content: e.target.value as string })
                            }}
                            style={{ width: "100%" }}
                        />

                        {file && user &&
                            <button onClick={(e) => handleFile(e)} className="rounded-full px-3 py-auto my-3 bg-slate-600 text-white" type="submit">save file</button >
                        }
                    </form>
                    <div className="flex flex-col mx-auto px-1 my-3">
                        {file && file.name && <input
                            accept={"image/png image/jpg image/jpeg"}
                            type="file"
                            name="file"
                            onChange={(e) => {
                                handleOnChange(e)
                            }}
                        />}
                        {blogMsg && blogMsg.msg &&
                            <div className="relative h-[10vh] flex flex-col items-center justify-center">
                                {blogMsg.loaded ?
                                    <div className=" absolute inset-0 flex flex-col text-blue-900 text-xl">
                                        {blogMsg && blogMsg.msg}
                                    </div>
                                    :
                                    <div className=" absolute inset-0 flex flex-col text-orange-900 text-xl">
                                        {blogMsg && blogMsg.msg}
                                    </div>
                                }
                            </div>
                        }
                    </div>
                    <div className={`${styles.fileCreateInput} bg-slate-300`}>

                        <div className="text-center text-xl mb-2">{file.name && file.name}</div>
                        <div className="text-center text-xl my-2">{file.title && file.title}</div>
                        {file.imageUrl && <Image src={file.imageUrl} width={600} height={400} alt="www"
                            className="aspect-video"
                            style={{ width: "auto" }}
                        />}
                        {file.content && <p className="px-2 my-1 text-md">{file.content}</p>}
                        <CreateInputs user={user} fileId={file.id} />

                        <div className="flex flex-col items-center justify-center my-2 mx-auto">
                            <div className="flexrow">
                                <Link href={`/dashboard/blogdetail/${file.id}`}
                                    className="mx-auto my-1">
                                    <button className={`mx-auto ${styles.btnSubmit}`}>view blog</button>
                                </Link>
                                <Link href={`/dashboard`}
                                    className="mx-auto my-1">
                                    <button className={`mx-auto ${styles.btnSubmit}`}>Dashboard</button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </React.Fragment>
            }
        </div>
    )
}
