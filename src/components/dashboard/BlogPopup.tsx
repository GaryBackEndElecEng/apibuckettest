"use client";
import React from 'react';
import styles from "./dashboard.module.css"
import { getErrorMessage } from '@/lib/errorBoundaries';
import { fileType } from '@/lib/Types';
import { useBlogContext } from '../context/BlogContextProvider';
import { toast } from 'react-hot-toast';

type fetchDelType = {
    file: fileType,
    message: string
}
type popupType = {
    fileId: string | undefined,
    setShowPopup: React.Dispatch<React.SetStateAction<{
        loaded: boolean;
        id: string | undefined;
    }>>,

}
export default function BlogPopup({ fileId, setShowPopup }: popupType) {
    const { setBlogMsg, setUserBlogs, userBlogs } = useBlogContext();

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/file?fileId=${fileId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                const body: fetchDelType = await res.json();
                setBlogMsg({ loaded: true, msg: body.message });
                const reduce_ = userBlogs.filter(file => file.id === fileId);
                setUserBlogs(reduce_);
                toast.success(body.message)


            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@BlogPopup@file@delete`)
        }

    }
    const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setShowPopup({ loaded: false, id: undefined });
    }

    return (
        <div
            className={styles.mainPopup}
        >
            <div className="flexrow">
                <button className={styles.btnPopup}
                    onClick={(e) => handleDelete(e)}
                >
                    DELETE<span style={{ color: "red", marginLeft: "0.75rem", fontSize: "110%", fontWeight: "bold", background: "white" }}>?</span>
                </button>
                <button className={styles.btnPopup}
                    onClick={(e) => handleCancel(e)}
                >
                    cancel<span style={{ color: "red", marginLeft: "0.75rem" }}>?</span>
                </button>
            </div>

        </div>
    )
}
