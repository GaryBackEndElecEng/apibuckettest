import { userType, fileType } from '@/lib/Types';
import React from 'react';
import styles from "@dashboard/dashboard.module.css"
import { useBlogContext } from '../context/BlogContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import UserBlog from "@dashboard/UserBlog";

type userFetchType = {
    files: fileType[],
    message: string
}
export default function UserBlogs({ user }: { user: userType | null }) {
    const { userBlogs, setUserBlogs, setBlogMsg, blogMsg } = useBlogContext();

    React.useEffect(() => {
        if (user) {
            const getUserBlogs = async () => {
                try {
                    const res = await fetch(`/api/userblogs?userId=${user.id}`);
                    const body: userFetchType = await res.json();
                    if (res.ok) {
                        setUserBlogs(body.files);
                        setBlogMsg({ loaded: true, msg: body.message });
                    } else if (res.status > 200 && res.status < 500) {
                        setBlogMsg({ loaded: false, msg: body.message })
                    }

                } catch (error) {
                    const message = getErrorMessage(error);
                    setBlogMsg({ loaded: false, msg: message })
                }
            }
            getUserBlogs();
        }

    }, [user, setUserBlogs, setBlogMsg]);

    return (
        <div className={styles.mainUserBlogs}>
            <div className={styles.userMainGrid}>
                {
                    userBlogs && userBlogs.map((blog, index) => (
                        <div key={index}>
                            <UserBlog blog={blog} user={user} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
