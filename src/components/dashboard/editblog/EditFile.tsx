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
import styles from "@dashboard/editblog/editblog.module.css";
import "@pages/globalsTwo.css"
import { SeparatePara } from "@lib/ultils";
import Link from 'next/link';
import toast, { ToastBar } from 'react-hot-toast';


type fetchType = {
    file: fileType,
    message: string,
}
type mainCreateFileType = {
    user: userType | null,
    file: fileType | undefined
}
export default function EditFile({ user, file }: mainCreateFileType) {
    const url = "https://garyposttestupload.s3.amazonaws.com";
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
                toast.success(" saved")
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
        if (e.target.files && user && file) {
            const fileImg = e.target.files[0]
            const formData = new FormData();
            formData.set("file", fileImg);
            const Key = `${user.name?.trim()}/${file.id}/${uuidv4()}-${fileImg.name}`;
            formData.set("Key", Key);
            const { data } = await axios.post("/api/media", formData)
            if (data.status === 200) {
                setFile_({ ...file, imageKey: Key, imageUrl: `${url}/${Key}` });
                // setMessage({ loaded: true, msg: "saved" })
                toast.success("pic saved")
            } else if (data.status > 200 && data.status < 420) {
                toast.error("pic is too large, resize please")
            } else {
                // setMessage({ loaded: false, msg: "not saved" })
                toast.error(" pic not saved- something went wrong")
            }

        }

    }

    // console.log(file, "LOADED", loaded, "USERID", userId)
    const mainStyle = " mx-auto px-2 py-2 flex flex-col gap-2";
    const form = "flex flex-col gap-3 mx-auto";
    return (
        <React.Fragment>
            {file &&
                <div className={styles.mainFile}>
                    <form>

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
                            style={{ fontWeight: "bold" }}
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
                            className={styles.content}
                        />

                        {file && user &&
                            <button onClick={(e) => handleFile(e)} className="rounded-full px-3 py-auto my-3 bg-slate-600 text-white" type="submit">save file</button >
                        }
                    </form>
                    <div className={styles.mainFile}>
                        {file && file.name && <input
                            accept={"image/png image/jpg image/jpeg"}
                            type="file"
                            name="file"
                            onChange={(e) => {
                                handleOnChange(e)
                            }}
                        />}


                    </div>
                    <div className={styles.displayFile}>


                        <div className="text-center text-xl mb-2">{file.name && file.name}</div>
                        <h2 className={styles.fileTitle}>{file.title && file.title.toUpperCase()}</h2>
                        {file.imageUrl && <Image src={file.imageUrl} width={800} height={400} alt="www"
                            className={styles.fileImg}
                            priority
                            style={{ width: "auto" }}
                        />}
                        {file.content && <SeparatePara para={file.content} class_={styles.content} />}
                        <React.Fragment>
                            <CreateInputs user={user} fileId={file.id} />
                        </React.Fragment>

                        <Link href={`/dashboard/blogdetail/${file.id}`}
                            className="mx-auto my-2 ">
                            <button className="mx-auto button bg-black text-white">view blog</button>
                        </Link>

                    </div>

                </div>
            }
        </React.Fragment>
    )
}
