"use client";
import React from 'react';
import type { postType, msgType } from '@lib/Types';
import { TextField } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Image from 'next/image';
import { useBlogContext } from "@context/BlogContextProvider";
import { useGeneralContext } from '@context/GeneralContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';

export default function CreatePost() {
    const { file_ } = useBlogContext();
    const { user } = useGeneralContext()
    const [post, setPost] = React.useState<postType>({} as postType);
    const [message, setMessage] = React.useState<msgType>({} as msgType);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [complete, setComplete] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (user && file_ && post.userId) {
            setPost({ ...post, bloglink: `/blog/${file_.id}`, userId: user.id as string })
        }
    }, [user, file_, setPost]);

    React.useEffect(() => {
        if (post && post.name && post.content && post.s3Key && user && file_) {
            setComplete(true);
        }
    }, [post, user, setComplete, file_]);

    const handlepost = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (complete) {
            try {
                const { data } = await axios.post("/api/post", post);
                const body: postType = await data;
                setPost(body);
                setLoaded(true);
            } catch (error) {
                const message = getErrorMessage(error);
                console.log(`${message}@post`)
            }
        }

    }

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        if (e.target.files) {
            const file = e.target.files[0]
            const formData = new FormData();
            formData.set("file", file);
            const Key = `${post.name.split(".")[0]}/${uuidv4()}-${file.name}`;
            formData.set("Key", Key);
            const { data } = await axios.post("/api/media", formData)
            if (data.status === 200) {
                setPost({ ...post, s3Key: Key });
                setMessage({ loaded: true, msg: "saved" })
            } else {
                setMessage({ loaded: false, msg: "not saved" })
            }

        }

    }
    const mainStyle = " mx-auto px-2 py-2";
    const form = "flex flex-col gap-3 mx-auto";
    return (
        <div className={mainStyle}>
            <form className={form} onSubmit={(e) => handlepost(e)}>
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
                    value={post ? post?.name : " "}
                    onChange={(e) => setPost({ ...post, name: e.target.value as string })}
                />
                <TextField
                    fullWidth={true}
                    helperText={"content"}
                    id={"content"}
                    label={"content"}
                    multiline={true}
                    minRows={4}
                    name={"content"}
                    placeholder="content"
                    required
                    size={"medium"}
                    type="text"
                    variant="filled"
                    value={post ? post?.content : " "}
                    onChange={(e) => {

                        setPost({ ...post, content: e.target.value as string })
                    }}
                />

                {post &&
                    <button className="rounded-full px-3 py-auto my-3 bg-slate-600 text-white" type="submit">submit post</button>
                }
            </form>
            <div className="flex flex-col mx-auto px-1 my-3">
                {post && post.name && <input
                    accept={"image/png image/jpg image/jpeg"}
                    type="file"
                    name="file"
                    onChange={(e) => {
                        handleOnChange(e)
                    }}
                />}
                {message && message.msg &&
                    <div className="relative h-[10vh] flex flex-col items-center justify-center">
                        {message && message.loaded ?
                            <div className=" absolute inset-0 flex flex-col text-blue-900 text-xl">
                                {message && message.msg}
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
                {loaded && post &&
                    <React.Fragment>
                        <div className="text-center text-xl mb-2">{post.name}</div>
                        {post.imageUrl && <Image src={post.imageUrl} width={600} height={400} alt="www"
                            className="aspect-video"
                        />}
                        <p className="px-2 my-1 text-md">{post.content}</p>
                    </React.Fragment>
                }
            </div>

        </div>
    )
}