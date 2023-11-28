"use client";
import React from 'react';
import type { postType, msgType } from '@lib/Types';
import { TextField } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Image from 'next/image';
import { useBlogContext } from "@context/BlogContextProvider";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { usePostContext } from '@context/PostContextProvider';
import PostMsg from "@component/dashboard/createPost/PostMsg";
import styles from "@component/dashboard/editPost/editPostStyle.module.css";

type postFetchType = {
    post: postType,
    message: string
}
type EditPostType = {
    id: string
}
export default function EditPost({ id }: EditPostType) {
    const { setPosts, posts, setPostMsg, postMsg, setPost, post } = usePostContext()
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [temImage, setTemImage] = React.useState<string | undefined>();

    React.useEffect(() => {
        if (id) {
            const temPost: postType | undefined = posts?.find(post => (post.id === parseInt(id)));
            if (temPost) {
                setPost(temPost);
            }
        }
    }, [id, posts, setPost]);



    const handlepost = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (posts) {
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
                    setPosts([...posts, body.post]);
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
        setPost({
            ...post as postType,
            [e.target.name]: e.target.value
        })
    }


    return (
        <React.Fragment>
            {!loaded && post &&
                <div className={styles.mainEditPost}>
                    <PostMsg />
                    <form className={styles.editForm} onSubmit={(e) => handlepost(e)}>
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
                            value={post ? post?.content : " "}
                            onChange={postOnChange}
                            style={{ width: "100%" }}
                        />


                        <button className={styles.btnEdit} type="submit">submit post</button>

                    </form>



                    {post &&
                        <div className={styles.displayContent}>

                            <h1 >{post.name}</h1>
                            {post.imageUrl &&
                                <Image src={post.imageUrl} width={600} height={400} alt="www"

                                />
                            }
                            <p>{post.content}</p>

                        </div>
                    }


                </div>
            }
        </React.Fragment>

    )
}