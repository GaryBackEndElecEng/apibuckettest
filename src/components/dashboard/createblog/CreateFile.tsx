"use client";
import React from 'react';
import type { fileType, msgType } from '@lib/Types';
import { TextField } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Image from 'next/image';
import CreatePost from "@/components/dashboard/createblog/CreatePost";

export default function CreateFile({ userId }: { userId: string | undefined }) {
    const [file, setFile] = React.useState<fileType>({} as fileType);
    const [message, setMessage] = React.useState<msgType>({} as msgType);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [complete, setComplete] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (userId) {
            setFile({ ...file, userId: userId })
        }
    }, [userId]);

    React.useEffect(() => {
        if (file && file.name && file.content) {
            setComplete(true);
        }
    }, [file, setComplete]);

    const handleFile = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (complete) {
            try {
                const { data } = await axios.post("/api/file", file);
                const body: fileType = await data;
                console.log("recieved", body)
                setFile(body);
                setLoaded(true);
            } catch (error) {
                console.log(new Error("did not send"))
            }
        }

    }

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        if (e.target.files) {
            const file_ = e.target.files[0]
            const formData = new FormData();
            formData.set("file", file_);
            const Key = `${file_.name.split(".")[0]}/${uuidv4()}-${file_.name}`;
            formData.set("Key", Key);
            const { data } = await axios.post("/api/media", formData)
            if (data.status === 200) {
                setFile({ ...file, imageKey: Key });
                setMessage({ loaded: true, msg: "saved" })
            } else {
                setMessage({ loaded: false, msg: "not saved" })
            }

        }

    }
    // console.log(file, "LOADED", loaded, "USERID", userId)
    const mainStyle = " mx-auto px-2 py-2";
    const form = "flex flex-col gap-3 mx-auto";
    return (
        <React.Fragment>
            <div className={mainStyle}>
                <form className={form} onSubmit={(e) => handleFile(e)}>
                    <TextField
                        fullWidth={false}
                        helperText={"name"}
                        id={"name"}
                        label={"name"}
                        multiline={false}
                        name={"name"}
                        placeholder="name"
                        required
                        size={"medium"}
                        type="text"
                        variant="filled"
                        value={file ? file?.name : " "}
                        onChange={(e) => setFile({ ...file, name: e.target.value as string })}
                    />
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
                        onChange={(e) => setFile({ ...file, title: e.target.value as string })}
                    />
                    <div className="flex flex-row my-2 mx-auto gap-2">
                        <label htmlFor="published">published</label>
                        <input
                            id="published"
                            type={"checkbox"}
                            name="published"
                            value={file ? String(file.published) : "false"}
                            onChange={(e) => setFile({ ...file, published: Boolean(e.target.value) })}
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

                            setFile({ ...file, content: e.target.value as string })
                        }}
                    />

                    {file && userId &&
                        <button className="rounded-full px-3 py-auto my-3 bg-slate-600 text-white" type="submit">submit file</button>
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
                    {message.msg &&
                        <div className="relative h-[10vh] flex flex-col items-center justify-center">
                            {message.loaded ?
                                <div className=" absolute inset-0 flex flex-col text-blue-900 text-xl">
                                    {message.msg}
                                </div>
                                :
                                <div className=" absolute inset-0 flex flex-col text-orange-900 text-xl">
                                    {message.msg}
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className="flex flex-col px-2 my-2">
                    {loaded && file &&
                        <React.Fragment>
                            <div className="text-center text-xl mb-2">{file.name}</div>
                            <div className="text-center text-xl my-2">{file.title}</div>
                            {file.imageUrl && <Image src={file.imageUrl} width={600} height={400} alt="www"
                                className="aspect-video"
                            />}
                            <p className="px-2 my-1 text-md">{file.content}</p>
                        </React.Fragment>
                    }
                </div>

            </div>
            {loaded && file.id && <CreatePost userId={userId} fileId={file.id} />}
        </React.Fragment>
    )
}
