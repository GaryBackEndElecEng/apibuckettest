"use client";
import React from 'react';
import type { postType, msgType, userType, blogLinkType } from '@lib/Types';
import { TextField } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Image from 'next/image';
import { useBlogContext } from "@context/BlogContextProvider";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { usePostContext } from '@context/PostContextProvider';
import PostMsg from "@component/dashboard/createPost/PostMsg";
import styles from "@component/dashboard/editPost/editPostStyle.module.css";
import { useRouter } from "next/navigation";
import { useGeneralContext } from '@/components/context/GeneralContextProvider';

type postFetchType = {
    post: postType,
    message: string
}
type EditPostType = {
    getpost: postType | undefined,
    getuser: userType,
    getblogLinks: blogLinkType[] | undefined
}
export default function EditPost({ getuser, getpost, getblogLinks }: EditPostType) {
    const router = useRouter();
    const { setPosts, posts, setPostMsg, postMsg, setPost, post } = usePostContext();
    const { setUser, user } = useGeneralContext();
    const { blogLinks, setBlogLinks } = usePostContext()
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [temImage, setTemImage] = React.useState<string | undefined>();
    const [blogLink, setBlogLink] = React.useState<string>("")



    React.useEffect(() => {
        if (!getuser) return
        setUser(getuser);
        if (!getpost) return
        setPost(getpost);
        setPostMsg({ loaded: true, msg: "recieved" });
    }, [getpost, setPost, setUser, getuser, setPostMsg]);

    React.useEffect(() => {
        if (!getblogLinks) return;
        setBlogLinks(getblogLinks)
    }, [setBlogLinks, getblogLinks]);



    const handlepost = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (post) {
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
                    router.push("/dashboard/posts");
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

    const handleBlogLinkOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        if (e) {
            const fileId = e.target.value
            const blog_lnk = blogLinks.find(lk => lk.fileId === fileId);

            if (blog_lnk && post) {
                setPost({ ...post, bloglink: `/blogs/${fileId}` })
            }
        }
    }

    return (
        <React.Fragment>
            {!loaded && post &&
                <div className={styles.mainEditPost}>
                    <PostMsg />
                    <form className={`${styles.editForm} bg-slate-200`} onSubmit={(e) => handlepost(e)}>
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
                    <form className={styles.editForm}>
                        <h3 className="text-center font-bold underline underline-offset-8 text-slate-100 text-xl"> attach a blog</h3>
                        <select
                            name="blogLink"
                            onChange={(e) => handleBlogLinkOnChange(e)}
                        >
                            {blogLinks && blogLinks.map((blogLn, index) => (
                                <React.Fragment key={index}>
                                    <option value={blogLn.fileId}>{blogLn.name}</option>
                                </React.Fragment>
                            ))}
                        </select>
                    </form>



                    {post &&
                        <div className={`${styles.displayContent} bg-slate-200`}>

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