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
import toast from 'react-hot-toast';
import { joinName } from '@/lib/ultils';

type postFetchType = {
    post: postType,
    message: string
}
type createMainCreatePost = {
    user: userType | null,
    newpost: postType | undefined
}

export default function CreatePost({ user, newpost }: createMainCreatePost) {
    const { userBlogs } = useBlogContext();
    const { setPost, post, setPosts, posts, setPostMsg, setUserPosts, userPosts } = usePostContext()
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [complete, setComplete] = React.useState<boolean>(false);
    const [isBlogLink, setIsBlogLink] = React.useState<boolean>(false);
    const [temImage, setTemImage] = React.useState<string | undefined>();

    React.useEffect(() => {
        if (!newpost) return
        setPost(newpost)
        toast.success("new post")
    }, [newpost, setPost]);

    React.useEffect(() => {
        if (!user) return
        setUserPosts(user.posts)
    }, [user, setUserPosts])

    //bloglink: `/blog/${file_.id}`


    React.useEffect(() => {
        if (post && post.name && post.content && post.userId) {
            setComplete(true);

        }

    }, [post, user, setComplete]);


    const handlepost = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (complete) {
            try {
                const res = await fetch("/api/post", {
                    method: "PUT",
                    body: JSON.stringify(post)
                });
                if (res.ok) {
                    const body: postFetchType = await res.json();
                    setPost(body.post);
                    setPostMsg({ loaded: true, msg: body.message });
                    setTemImage(undefined);
                    setLoaded(true);
                    setComplete(false);
                    setPosts([...posts as postType[], body.post]);
                    setUserPosts([...userPosts, body.post])
                }
            } catch (error) {
                const message = getErrorMessage(error);
                console.error(`${message}@post`);
                setPostMsg({ loaded: false, msg: message })
            }
        }

    }


    const postOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.preventDefault();
        setPost({
            ...post as postType,
            [e.target.name]: e.target.value
        })
    }
    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        if (e.target.files && post && post.name && user) {
            const file = e.target.files[0]
            const formData = new FormData();
            formData.set("file", file);
            const joinUser = joinName(user.name as string)
            const combinedName = joinName(post.name)
            const Key = `${joinUser}/post/${combinedName.replace("?", "")}-${uuidv4()}-${file.name}`;
            formData.set("Key", Key);
            setTemImage(URL.createObjectURL(file));
            const res = await fetch("/api/media", {
                method: "POST", body: formData
            });
            if (res.ok) {
                setPost({ ...post, s3Key: Key });
                toast.success("image uploaded")
            } else {
                toast.error("image not uploaded")
            }

        } else {
            toast.error(" missing name or content")
        }

    }

    const handleSubmitAnother = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setPost(undefined);
        setTemImage(undefined);
        const tempPost = { ...post, name: "fill", content: "body" } as postType
        setPost(tempPost);
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
                            value={post?.name}
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
                            value={post?.content}
                            onChange={postOnChange}
                            style={{ width: "100%" }}
                        />
                        <label htmlFor="isBlogLink">attach a blog?</label>
                        <input
                            id="isBlogLink"
                            type="checkbox"
                            checked={isBlogLink}
                            onChange={(e) => setIsBlogLink(e.target.checked)}
                        />
                        {userBlogs && isBlogLink ?
                            (<React.Fragment>
                                <label htmlFor="bloglink">attach a blog?</label>
                                <select
                                    id="bloglink"
                                    name="bloglink"
                                    onChange={postOnChange}
                                >
                                    {userBlogs.map((file, index) => {
                                        if (file.id && index > 0) {
                                            const postU = `/blogs/${file.id}`
                                            return (
                                                <option key={index} value={postU}>{file.title}</option>
                                            )
                                        } else {
                                            return (
                                                <option key={index} disabled={true}>select</option>
                                            )
                                        }
                                    })}
                                </select>
                            </React.Fragment>)
                            :
                            (
                                <TextField
                                    fullWidth={false}
                                    helperText={"Add a link"}
                                    id={"link"}
                                    label={"add a link"}
                                    multiline={false}
                                    name={"bloglink"}
                                    placeholder="add a link"
                                    size={"medium"}
                                    type="text"
                                    value={post?.bloglink}
                                    onChange={postOnChange}
                                />
                            )
                        }

                        {complete &&
                            <button className={styles.btnCreateSubit} type="submit">submit post</button>
                        }
                    </form>
                ) : (
                    <button className={styles.btnCreateSubit} type="submit" onClick={(e) => handleSubmitAnother(e)}>submit another <span style={{ color: "red", fontSize: "130%" }}>?</span></button>
                )}


                <div className="flex flex-col mx-auto px-1 my-3">
                    {post && post.name && <input
                        accept={"image/png image/jpg image/jpeg"}
                        type="file"
                        name="file"
                        onChange={(e) => {
                            handleOnChange(e)
                        }}
                    />}

                </div>
            </React.Fragment>


            {post && !temImage &&
                <div className={styles.displayContent}>

                    <h1 >{post.name}</h1>
                    {post.imageUrl &&
                        <Image src={post.imageUrl} width={600} height={400} alt="www"

                        />
                    }
                    <p>{post.content}</p>

                </div>
            }
            {post && temImage &&
                <div className={styles.displayContent}>

                    <h1 >{post.name}</h1>

                    {temImage &&
                        <Image src={temImage} width={600} height={400} alt="www"

                        />
                    }
                    <p>{post.content}</p>


                </div>
            }
            <Link href={"/dashboard/posts"}>
                <button className={styles.btnCreateSubit}>See your posts <span style={{ fontSize: "140%", color: "red", marginLeft: "10px" }}>?</span></button>
            </Link>
        </div>
    )
}