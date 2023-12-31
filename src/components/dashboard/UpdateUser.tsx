"use client";
import React from 'react';
import type { userType, msgType } from '@lib/Types';
import { TextField, dividerClasses } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { genHash } from "@lib/ultils";
import Image from "next/image";
import { useGeneralContext } from "@context/GeneralContextProvider";
import styles from '@component/dashboard/dashboard.module.css';
import { getErrorMessage } from '@/lib/errorBoundaries';
import Message from "./Message";
import toast from 'react-hot-toast';
import { SeparateParaBio } from "@lib/ultils";

type fetchUserType = {
    user: userType,
    message: string
}

export default function UpdateUser({ user }: { user: userType | null }) {
    const url = "https://garyposttestupload.s3.amazonaws.com";
    const { setUser } = useGeneralContext();
    const [message, setMessage] = React.useState<msgType>();
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string | undefined>();
    const [showPswd, setShowPswd] = React.useState<boolean>(false);
    const mainStyle = " mx-auto px-2 py-2 bg-slate-200 mt-8";
    const form = "flex flex-col gap-3 mx-auto";
    const logo = "/images/gb_logo.png"

    const handleUser = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (user) {
            let tempUser = user;
            if (password) {
                let hash = await genHash(password);
                setUser({ ...user, password: hash });
                tempUser.password = hash
            }
            try {
                const res = await fetch("/api/user", { method: "PUT", body: JSON.stringify(tempUser) });
                const body: fetchUserType = await res.json();
                if (res.ok) {
                    setUser(body.user);
                    setMessage({ loaded: true, msg: body.message })
                    setLoaded(true);
                    toast.success(`Updated user:${body.message}`)
                }
            } catch (error) {
                const message = getErrorMessage(error);
                console.log(`${message}@user`)
                toast.error("something went wrong")
            }
        } else {
            setMessage({ loaded: false, msg: "please complete your bio. This improves hits." })
        }

    }

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        if (e.target.files && user) {
            const file = e.target.files[0]
            const formData = new FormData();
            formData.set("file", file);
            const Key = `${user.name?.trim()}/${uuidv4()}-${file.name}`;
            formData.set("Key", Key);
            const res = await fetch("/api/media", { method: "POST", body: formData })
            if (res.ok) {
                setUser({ ...user, imgKey: Key, image: `${url}/${Key}` });
                setMessage({ loaded: true, msg: "saved" })
            } else {
                setMessage({ loaded: false, msg: "not saved" })
            }

        }

    }
    const userChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setUser({
            ...user as userType,
            [e.target.name]: e.target.value
        })
    }
    const paraclass = "text-md px-2 my-2 text-white"
    return (
        <div className={styles.userUpDatemain}>
            {user &&
                <div className={styles.gridTwo}>
                    <div className={styles.gridTwoFormContainer}>
                        <div style={{ width: "100%" }}>
                            <form className={`${styles.userForm} bg-slate-500`} onSubmit={(e) => handleUser(e)}>
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
                                    value={user.name ? user?.name : ""}
                                    onChange={(e) => userChange(e)}
                                    style={{ width: "75%" }}
                                    className="bg-slate-100 text-black"
                                />
                                <TextField
                                    fullWidth={false}
                                    helperText={"email"}
                                    id={"email"}
                                    label={"email"}
                                    multiline={false}
                                    name={"email"}
                                    placeholder="email"
                                    required
                                    size={"medium"}
                                    type="email"
                                    variant="filled"
                                    value={user.email ? user.email : ""}
                                    onChange={(e) => userChange(e)}
                                    style={{ width: "75%" }}
                                    className="bg-slate-100 text-black"
                                />
                                <div className="flexrowsm" style={{ width: "auto" }}>
                                    <TextField
                                        fullWidth={true}
                                        helperText={"password"}
                                        id={"password"}
                                        label={"password"}
                                        multiline={false}
                                        name={"password"}
                                        placeholder="password"
                                        size={"medium"}
                                        type={showPswd ? "text" : "password"}
                                        variant="filled"
                                        value={password ? password : ""}
                                        onChange={async (e) => {

                                            setPassword(e.target.value)
                                        }}
                                        className="bg-slate-100 text-black"
                                    />
                                    <input
                                        type="checkbox"
                                        checked={showPswd}
                                        value={String(showPswd)}
                                        onChange={(e) => setShowPswd(Boolean(e.target.value))}
                                    />
                                </div>
                                <TextField
                                    fullWidth={true}
                                    helperText={"bio"}
                                    id={"bio"}
                                    label={"bio"}
                                    multiline={true}
                                    minRows={4}
                                    name={"bio"}
                                    placeholder="bio"
                                    required
                                    size={"medium"}
                                    type="bio"
                                    variant="filled"
                                    value={user.bio ? user.bio : ""}
                                    onChange={(e) => userChange(e)}
                                    className="bg-slate-100 text-black w-full"
                                />


                                <button className={styles.buttonsm} type="submit">submit user</button>

                            </form>
                        </div>
                        <div className="flex flex-col mx-auto px-1 my-3">
                            {user.name && <input
                                accept={"image/png image/jpg image/jpeg"}
                                type="file"
                                name="file"
                                onChange={(e) => {
                                    handleOnChange(e)
                                }}
                            />}
                            {message && message.msg &&
                                <Message msg={message} setMsg={setMessage} />
                            }
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-slate-700 text-white bg-slate-900" style={{ background: "black" }}>
                        {user &&
                            <React.Fragment>
                                <div className="text-center text-xl mb-2">{user.name}</div>
                                <h3 className="text-xl px-1 py-1 underline underline-offest-8 ">Who am I</h3>


                                <p className="text-md px-2 my-2 text-white">
                                    {user.image && user.imgKey ?
                                        <Image src={user.image}
                                            width={125}
                                            height={125}
                                            className={styles.userImage}
                                            alt="www"
                                            placeholder="blur"
                                            blurDataURL={user.image}
                                        />
                                        :
                                        <Image src={logo}
                                            width={125}
                                            height={125}
                                            className={styles.userImage}
                                            alt="www"
                                            placeholder="blur"
                                            blurDataURL={logo}
                                        />
                                    }
                                    {user.bio}
                                </p>
                            </React.Fragment>
                        }
                    </div>

                </div>
            }
        </div>
    )
}
function showPswd_(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    e.preventDefault();
    const getpswdELE: HTMLInputElement | null = document.getElementById("password") as HTMLInputElement;

    let bool: string = e.currentTarget.value
    if (getpswdELE) {
        if (bool === "true") {
            getpswdELE.type = "text"
        } else if (bool === "false") {
            getpswdELE.type = "password"
        }
    }

}
