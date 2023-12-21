"use client"
import { userType } from '@/lib/Types';
import React from 'react';
import styles from "./remove.module.css";
import Thankyou from "./Thankyou";
import { PrismaClient } from "@prisma/client";
import { getErrorMessage } from '@/lib/errorBoundaries';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function AccRemoved({ user }: { user: userType }) {
    const router = useRouter();
    const [isDeleted, setIsDeleted] = React.useState<boolean>(false);
    const [toBeDeleted, setToBeDeleted] = React.useState<boolean>(false);
    const posts = user.posts;
    const files = user.files;
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (toBeDeleted) {
            const retMsg = await toDelete(user);
            setIsDeleted(retMsg);
            toast.success("account deleted")
            router.push(`/contactUs?deletedAcc=${retMsg}`);
        }

    }
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setToBeDeleted(e.currentTarget.checked)
    }

    return (
        <section className={styles.mainSubRemove}>
            <div className={styles.accRemoveCard}>
                <h1>{"The following will be removed".toUpperCase()}</h1>
                <h2>{user.name}</h2>
                <h3>{user.email}</h3>
                {files && files.map((file, index) => (
                    <div key={index}>
                        <div className={styles.innerCard}>
                            <h4>{file.name}</h4>
                            <h4>{file.title}</h4>
                            <p>{file.content}</p>
                        </div>
                    </div>
                ))
                }
                {posts && posts.map((post, index) => (
                    <div key={index}>
                        <div className={styles.innerCard}>
                            <h4>{post.name}</h4>
                            <p>{post.content}</p>
                        </div>
                    </div>
                ))
                }
            </div>
            <div className={styles.form}>
                <h3>delete?</h3>
                <input
                    type="checkbox"
                    checked={toBeDeleted}
                    onChange={(e) => handleOnChange(e)}
                />
                <button className="buttonsm bg-slate-800 text-white px-3 py-1" onClick={(e) => handleDelete(e)}>delete account</button>
            </div>
            {isDeleted && <Thankyou user={user} isDeleted={isDeleted} />}
        </section>
    )
}


export async function toDelete(user: userType) {

    let isDeleted: boolean = false;
    if (user && user.email) {
        const email: string = user.email as string;
        try {
            const res = await fetch(`/api/user?email=${email}`, { method: "DELETE" });
            const body: { user: userType, message: string } = await res.json()
            console.log(body)
            isDeleted = true
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@user@accountRemove`);
            isDeleted = false;
        }
    }

    return isDeleted
}
