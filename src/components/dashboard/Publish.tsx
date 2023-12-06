import React from 'react';
import type { fileType } from "@lib/Types";
import styles from "@component/dashboard/dashboard.module.css";
import { useBlogContext } from '../context/BlogContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { BsFillSendFill } from "react-icons/bs";
import { IoCheckmark } from "react-icons/io5";
import { IconButton } from "@mui/material";

type fetchPubType = {
    file: fileType,
    message: string
}
export default function Publish({ file }: { file: fileType }) {
    const { setFile_, setBlogMsg, blogMsg } = useBlogContext();
    const [publish, setPublish] = React.useState<boolean>(false);

    React.useEffect(() => {
        setPublish(file.published);
    }, []);


    const sendPub = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        let TFile = { ...file, published: publish }
        const controller = new AbortController();
        try {
            const res = await fetch("/api/file", {
                method: "PUT",
                body: JSON.stringify(TFile),
                signal: controller.signal
            });
            if (res.ok) {
                const body: fetchPubType = await res.json();
                setFile_(body.file);
                setPublish(body.file.published)
                setBlogMsg({ loaded: true, msg: body.message });

            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@file@dashboard@publish`);
        } finally {
            return () => controller.abort()
        }
    }



    return (
        <div className={styles.dashPublish}>
            <label style={{ display: "flex", gap: "10px" }}>
                publish
                <IoCheckmark className={publish ? styles.checked : styles.unChecked} />
            </label>
            <input
                type="checkbox"
                name="publish"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
                style={{ color: "red" }}
            />
            <IconButton onClick={(e) => sendPub(e)} style={{ display: "flex", gap: "5px" }}>
                <BsFillSendFill className={`bg-blue-500 ${styles.btnPublish} `} />
            </IconButton>
        </div>
    )
}
