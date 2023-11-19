"use client";
import React from 'react';
import styles from "@component/register/register.module.css";
import { v4 as uuidv4 } from "uuid";
import { msgType, userType } from '@/lib/Types';
import { useDashboardContext } from "@context/DashBoardContextProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UploadImg({ user }: { user: userType | null }) {
    const router = useRouter();
    const { setUser, } = useDashboardContext();
    const [msg, setMsg] = React.useState<msgType>({ loaded: false, msg: "" });
    const [uploaded, setUploaded] = React.useState<boolean>(false);

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && user) {
            const formData = new FormData()
            const file = e.target.files[0];
            formData.set("file", file);
            const genKey = `${uuidv4().split("-")[0]}`
            const Key = `${genKey}-${file.name.split(".")[0]}-${genKey}.${file.name}.${file.name.split(".")[1]}`
            formData.set("Key", Key)
            const res = await fetch("/api/media", {
                method: "POST",
                body: formData
            });
            if (res.ok) {
                setUser({ ...user, imgKey: Key });
                setUploaded(true);
                setMsg({ loaded: true, msg: "saved" })
                router.push("/dashboard")
            } else {
                setMsg({ loaded: false, msg: "not saved" })
            }
        }

    }
    return (
        <div className={styles.form}>
            <input
                type="file"
                name="file"
                accept="image/png image/jpg image/jpeg"
                onChange={onChange}
            />
            {
                uploaded && user && user.image &&
                <div className={styles.profileImg}>
                    <Image src={user.image} width={125} height={125} alt={user.name ? user.name : "www.ablogroom.com"} />
                </div>
            }
        </div>
    )
}
