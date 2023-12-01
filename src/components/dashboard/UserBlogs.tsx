import { userType, fileType } from '@/lib/Types';
import React from 'react';
import styles from "@dashboard/dashboard.module.css"
import { useBlogContext } from '../context/BlogContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import UserBlog from "@dashboard/UserBlog";
import { AiFillDelete } from "react-icons/ai";
import { IconButton } from '@mui/material';
import BlogPopup from "./BlogPopup";
import Link from 'next/link';
import Publish from "./Publish";

type userFetchType = {
    files: fileType[],
    message: string
}
type userBlogsType = {
    user: userType | null,
    getFiles: fileType[]
}
export default function UserBlogs({ user, getFiles }: userBlogsType) {
    const { userBlogs, setUserBlogs, setBlogMsg, blogMsg } = useBlogContext();
    const [showPopup, setShowPopup] = React.useState<{ loaded: boolean, id: string | undefined }>({ loaded: false, id: undefined })

    React.useEffect(() => {
        if (!getFiles) return
        setUserBlogs(getFiles);
    }, [getFiles, setUserBlogs])

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.preventDefault();
        if (id) {
            setShowPopup({ loaded: true, id: id })
        }

    }
    return (
        <div className={styles.mainUserBlogs}>
            <div className={styles.userMainGrid}>
                {
                    userBlogs && userBlogs.map((blog, index) => (
                        <div key={index} style={{ position: "relative" }}>
                            <Publish file={blog} />
                            <IconButton
                                className={styles.deleteFile}
                                onClick={(e) => handleDelete(e, blog.id as string)}
                            >
                                <AiFillDelete style={{ color: "red", background: "black" }} />
                            </IconButton>
                            {showPopup.loaded && showPopup.id === blog.id &&
                                <BlogPopup fileId={blog.id} setShowPopup={setShowPopup} />
                            }
                            <UserBlog blog={blog} user={user} />
                            <Link href={`/dashboard/blogdetail/${blog.id}`} className="flexcol">
                                <button className={styles.btnPopup}>view detail</button>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
