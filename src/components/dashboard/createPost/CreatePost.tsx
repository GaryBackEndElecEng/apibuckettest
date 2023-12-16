"use client";
import React from 'react';
import type { postType, msgType, userType } from '@lib/Types';
import { TextField } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Image from 'next/image';
import { useBlogContext } from "@context/BlogContextProvider";
import { useGeneralContext } from '@context/GeneralContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { usePostContext } from '@context/PostContextProvider';
import PostMsg from "@component/dashboard/createPost/PostMsg";
import styles from "@component/dashboard/createPost/createpost.module.css";
import { Session } from 'next-auth';
import Link from 'next/link';

type postFetchType = {
    post: postType,
    message: string
}
type createMainCreatePost = {
    user: userType | null,
    post: postType | undefined
}

export default function CreatePost({ user, post }: createMainCreatePost) {
    const { userBlogs } = useBlogContext();
    const { setPost, setPosts, posts, setPostMsg, postMsg } = usePostContext()
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [complete, setComplete] = React.useState<boolean>(false);
    const [temPost, setTemPost] = React.useState<postType>({} as postType);
    const [temImage, setTemImage] = React.useState<string | undefined>();



    //bloglink: `/blog/${file_.id}`
    React.useEffect(() => {
        if (user && !temPost.userId) {
            setTemPost({ ...temPost, userId: user.id as string });
        }
    }, [user, setTemPost, temPost]);

    React.useEffect(() => {
        if (temPost && temPost.name && temPost.content && temPost.userId) {
            setComplete(true);
        }
    }, [temPost, user, setComplete]);


    const handlepost = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (complete) {
            try {
                const res = await fetch("/api/post", {
                    method: "POST",
                    body: JSON.stringify(temPost)
                });
                if (res.ok) {
                    const body: postFetchType = await res.json();
                    setPost(body.post);
                    setPostMsg({ loaded: true, msg: body.message });
                    setTemImage(undefined);
                    setTemPost({} as postType);
                    setLoaded(true);
                    setComplete(false);
                    setPosts([...posts as postType[], body.post]);
                }
            } catch (error) {
                const message = getErrorMessage(error);
                console.error(`${message}@post`);
                setPostMsg({ loaded: false, msg: message })
            }
        }

    }

    const postOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setTemPost({
            ...temPost,
            [e.target.name]: e.target.value
        })
    }
    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        if (e.target.files && temPost && temPost.name) {
            const file = e.target.files[0]
            const formData = new FormData();
            formData.set("file", file);
            const Key = `${temPost.name.trim()}/${uuidv4()}-${file.name}`;
            formData.set("Key", Key);
            setTemImage(URL.createObjectURL(file));
            const res = await fetch("/api/media", {
                method: "POST", body: formData
            });
            if (res.ok) {
                setTemPost({ ...temPost, s3Key: Key });
                setPostMsg({ loaded: true, msg: "saved" })
            } else {
                setPostMsg({ loaded: false, msg: "not saved" })
            }

        } else {
            setPostMsg({ loaded: false, msg: " missing name or content" })
        }

    }

    const handleSubmitAnother = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setPost(undefined);
        setTemImage(undefined);
        setTemPost({} as postType);
        setLoaded(false);
        setComplete(false);
        setPostMsg({ loaded: false, msg: "" })
    }
    return (
        <div className={styles.mainCreatePost}>

            <React.Fragment>
                <PostMsg />
                {!loaded ? (
                    <form className={styles.createForm} onSubmit={(e) => handlepost(e)}>
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
                            value={temPost ? temPost?.name : " "}
                            onChange={postOnChange}
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
                            value={temPost ? temPost?.content : " "}
                            onChange={postOnChange}
                            style={{ width: "100%" }}
                        />
                        {userBlogs &&
                            <React.Fragment>
                                <label htmlFor="bloglink">attach a blog?</label>
                                <select
                                    id="bloglink"
                                    name="bloglink"
                                    onChange={(e) => setTemPost({ ...temPost, [e.target.name]: e.target.value })}
                                >
                                    {userBlogs.map((file, index) => {
                                        if (file.id) {
                                            const postU = `/blogs/${file.id}`
                                            return (
                                                <option key={index} value={postU}>{file.title}</option>
                                            )
                                        }
                                    })}
                                </select>
                            </React.Fragment>
                        }

                        {complete &&
                            <button className={styles.btnCreateSubit} type="submit">submit post</button>
                        }
                    </form>
                ) : (
                    <button className={styles.btnCreateSubit} type="submit" onClick={(e) => handleSubmitAnother(e)}>submit another <span style={{ color: "red", fontSize: "130%" }}>?</span></button>
                )}


                <div className="flex flex-col mx-auto px-1 my-3">
                    {temPost && temPost.name && <input
                        accept={"image/png image/jpg image/jpeg"}
                        type="file"
                        name="file"
                        onChange={(e) => {
                            handleOnChange(e)
                        }}
                    />}

                </div>
            </React.Fragment>


            {post &&
                <div className={styles.displayContent}>

                    <h1 >{post.name}</h1>
                    {post.imageUrl &&
                        <Image src={post.imageUrl} width={600} height={400} alt="www"
                            className="aspect-video"
                        />
                    }
                    <p>{post.content}</p>

                </div>
            }
            {temPost &&
                <div className={styles.displayContent}>

                    <h1 >{temPost.name}</h1>

                    {temImage &&
                        <Image src={temImage} width={600} height={400} alt="www"
                            className="aspect-video"
                        />
                    }
                    <p>{temPost.content}</p>


                </div>
            }
            <Link href={"/dashboard/posts"}>
                <button className={styles.btnCreateSubit}>See your posts <span style={{ fontSize: "140%", color: "red", marginLeft: "10px" }}>?</span></button>
            </Link>
        </div>
    )
}