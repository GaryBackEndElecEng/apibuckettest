"use client"
import React from 'react';
import styles from "@dashboard/dashboard.module.css";
import type { fileType, postType, userType } from '@lib/Types';
import { getErrorMessage } from "@lib/errorBoundaries";
import Link from "next/link";
import { IoArrowDownSharp } from "react-icons/io5";
import { IoArrowUp } from "react-icons/io5";
import type { Session } from "next-auth";
import { useBlogContext } from "@/components/context/BlogContextProvider";
import BlogMsg from "@component/dashboard/createblog/BlogMsg";
import UpdateUser from '@/components/dashboard/UpdateUser';
import { useGeneralContext } from '../context/GeneralContextProvider';
import UserBlogs from "@dashboard/UserBlogs";
import UserFilesRates from "./UserFilesRates";
import UserPostsRates from "./UserPostsRates";
import BlogHits from "./BlogHits";
import PostHits from "./PostHits";
import MemberContact from "./MemberContact";
import Message from './Message';
import MasterLikes from './MasterLikes';

type resType = { user: userType | null, message: string }

type DashboardType = {
    getuser: userType,
    files: fileType[],
    posts: postType[]
}

export default function DashBoard_({ getuser, files, posts }: DashboardType) {

    const { setUser, user, setMsg, msg } = useGeneralContext();
    const { setBlogMsg, blogMsg, setUserBlogs, userBlogs } = useBlogContext()
    const [open, setOpen] = React.useState<boolean>(false);
    const [contactBtn, setContactBtn] = React.useState<boolean>(false);


    React.useEffect(() => {
        if (!getuser) return
        setUser(getuser);
    }, [getuser, setUserBlogs, setUser]);

    const handleOpen = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }

    return (
        <main className={`${styles.dashContainer} bg-slate-400`}>
            <div className={styles.masterGrid}>
                <div className={styles.grid_One}>
                    <div className={styles.rateStyles}>
                        <div>
                            <h3 className="font-bold text-center underline underline-offset-8 my-2">Blog rates</h3>
                            <details>
                                <summary>Blogs</summary>
                                <UserFilesRates files={files} />
                            </details>
                        </div>
                        <div>
                            <h3 className="font-bold text-center underline underline-offset-8 my-2">Post rates</h3>
                            <details>
                                <summary>posts</summary>
                                <UserPostsRates posts={posts} />
                            </details>
                        </div>
                        <div className="col-span-2">
                            <h3 className="font-bold text-center underline underline-offset-8 my-2">Blog hits</h3>
                            <details>
                                <summary>hits</summary>
                                <BlogHits files={files} />
                            </details>
                        </div>
                        <div className="col-span-2">
                            <h3 className="font-bold text-center underline underline-offset-8 my-2">Post hits</h3>
                            <details>
                                <summary>hits</summary>
                                <PostHits posts={posts} />
                            </details>
                        </div>
                        <div className="col-span-2">
                            <h3 className="font-bold text-center underline underline-offset-8 my-2">likes</h3>
                            <details>
                                <summary>likes</summary>
                                <MasterLikes files={files} posts={posts} />
                            </details>
                        </div>
                    </div>
                </div>
                <div className={styles.grid_Two} style={{ position: "relative" }}>
                    <BlogMsg />
                    <div className="flexrow">
                        <Link href={"/dashboard/createBlog"}>
                            <button className={`button.xs ${styles.buttonsm}`} >Create a blog</button>
                        </Link>
                        <Link href={"/dashboard/posts"}>
                            <button className={`button.xs ${styles.buttonsm}`}>posts</button>
                        </Link>
                    </div>
                </div>
                <div className={styles.grid_Three}>
                    {!contactBtn &&
                        <button className="buttonsm bg-black text-white" onClick={() => setContactBtn(true)}>message us</button>
                    }
                    {msg && msg.msg && <Message setMsg={setMsg} msg={msg} />}
                    <div className={contactBtn ? styles.openMember : styles.closeMember}>
                        {user && <MemberContact user={user} setMsg={setMsg}
                            contactBtn={contactBtn}
                            setContactBtn={setContactBtn} />}
                    </div>
                    <h1>space for messaging</h1>
                </div>

            </div>
            <div className="text-xl text-center my-1 mt-2 text-slate-200">Update profile</div>
            {open ?
                <button className={styles.userSummary}
                    onClick={(e) => handleOpen(e)}
                >
                    <IoArrowDownSharp /> Profile Update
                </button>
                :
                <button className={styles.userSummary}
                    onClick={(e) => handleOpen(e)}
                >
                    <IoArrowUp /> Profile Update
                </button>
            }
            <div className={open ? styles.openUpdateUser : styles.closeUdateUser}>

                <UpdateUser user={user} />
            </div>
            <UserBlogs user={user} getFiles={files} />
        </main>
    )
}
