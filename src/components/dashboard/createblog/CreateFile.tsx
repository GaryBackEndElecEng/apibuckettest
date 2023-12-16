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
import toast from 'react-hot-toast';
const url = "https://garyposttestupload.s3.amazonaws.com";

type fetchType = {
    file: fileType,
    message: string,
}
type mainCreateFileType = {
    user: userType,
    file: fileType
}
export default function CreateFile({ user, file }: mainCreateFileType) {
    const { setFile_, file_, setBlogMsg, blogMsg, input_s } = useBlogContext();
    const [message, setMessage] = React.useState<msgType>({} as msgType);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [complete, setComplete] = React.useState<boolean>(false);

    const handleFileUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setFile_({
            ...file_,
            [e.target.name]: e.target.value
        } as fileType)
    }

    const handleFile = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/file", {
                method: "PUT",
                body: JSON.stringify(file_)
            });
            const body: fetchType = await res.json();
            if (res.ok) {
                setFile_(body.file);
                setBlogMsg({ loaded: true, msg: body.message });
                setLoaded(true);
                toast.success(`blog saved: ${body.message}`)
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@file`)
            setBlogMsg({ loaded: false, msg: message });
            toast.error("something went wrong - try again")
        }


    }

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        if (e.target.files) {
            const pic = e.target.files[0]
            const formData = new FormData();
            formData.set("file", pic);
            const Key = `${user.name?.trim()}/${file.id}/${uuidv4()}-${pic.name}`;
            formData.set("Key", Key);
            const res = await fetch("/api/media", { method: "POST", body: formData })
            if (res.ok) {
                setFile_({ ...file_ as fileType, imageKey: Key });
                setMessage({ loaded: true, msg: "saved" });
                toast.success("picture saved")
            } else {
                setMessage({ loaded: false, msg: "not saved" });
                toast.error("picture not saved")
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
                            onChange={(e) => handleFileUpdate(e)}
                            style={{ width: "max-content" }}
                        />
                        <div className="flex flex-row my-2 mx-auto gap-2">
                            <label htmlFor="published">published</label>
                            <input
                                id="published"
                                type={"checkbox"}
                                name="published"
                                checked={file ? file.published : false}
                                onChange={(e) => setFile_({ ...file_ as fileType, published: e.target.checked })}
                            />
                        </div>
                        <TextField
                            fullWidth={true}
                            helperText={"summary"}
                            id={"summary"}
                            label={"summary"}
                            multiline={true}
                            minRows={4}
                            name={"content"}
                            placeholder="summary"
                            required
                            size={"medium"}
                            type="text"
                            variant="filled"
                            value={file ? file?.content : " "}
                            onChange={(e) => { handleFileUpdate(e) }}
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
