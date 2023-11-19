"use client";
import React from 'react';
import type { userType, msgType } from '@lib/Types';
import { TextField, dividerClasses } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { genHash } from "@lib/ultils";
import Image from "next/image";
import { useDashboardContext } from "@context/DashBoardContextProvider";
import styles from '@component/dashboard/dashboard.module.css';



export default function UpdateUser() {
    const { user, setUser } = useDashboardContext();
    const [message, setMessage] = React.useState<msgType>({} as msgType);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string>("");
    const [showPswd, setShowPswd] = React.useState<boolean>(false);
    const mainStyle = " mx-auto px-2 py-2 bg-slate-200 mt-8";
    const form = "flex flex-col gap-3 mx-auto";
    const logo = "/images/gb_logo.png"

    React.useMemo(async () => {
        if (password) {
            let hash = await genHash(password);
            setUser({ ...user, password: hash })
        }


    }, [password, setUser]);


    // console.log("USER", user)
    const handleUser = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (user) {
            try {
                const { data } = await axios.put("/api/user", user);
                const body: userType = await data;
                setUser(body);
                setLoaded(true);
            } catch (error) {
                console.log(new Error("did not send"))
            }
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
            const { data } = await axios.post("/api/media", formData)
            if (data.status === 200) {
                setUser({ ...user, imgKey: Key });
                setMessage({ loaded: true, msg: "saved" })
            } else {
                setMessage({ loaded: false, msg: "not saved" })
            }

        }

    }
    return (
        <div className={styles.userUpDatemain}>
            <div className={styles.gridTwo}>
                <div>
                    <div>
                        <form className={form} onSubmit={(e) => handleUser(e)}>
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
                                onChange={(e) => { setUser({ ...user, name: e.target.value }) }}
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
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />
                            <div className="flexrowsm">
                                <TextField
                                    fullWidth={false}
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
                                onChange={(e) => {

                                    setUser({ ...user, bio: e.target.value })
                                }}
                            />


                            <button className={styles.buttonsm} type="submit">submit user</button>

                        </form>
                    </div>
                    <div className="flex flex-col mx-auto px-1 my-3">
                        {user && user.name && <input
                            accept={"image/png image/jpg image/jpeg"}
                            type="file"
                            name="file"
                            onChange={(e) => {
                                handleOnChange(e)
                            }}
                        />}
                        {message.msg &&
                            <div className="relative h-[10vh] flex flex-col items-center justify-center">
                                {message.loaded ?
                                    <div className=" absolute inset-0 flex flex-col text-blue-900 text-xl">
                                        {message.msg}
                                    </div>
                                    :
                                    <div className=" absolute inset-0 flex flex-col text-orange-900 text-xl">
                                        {message.msg}
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {user &&
                        <React.Fragment>
                            <div className="text-center text-xl mb-2">{user.name}</div>
                            <h3 className="text-xl px-1 py-1 underline underlin-offest-8">Who am I</h3>
                            <p className="text-md px-2 my-2">
                                {user.image ?
                                    <Image src={user.image}
                                        width={125}
                                        height={125}
                                        className={styles.userImage}
                                        alt="www"
                                    />
                                    :
                                    <Image src={logo}
                                        width={125}
                                        height={125}
                                        className={styles.userImage}
                                        alt="www"
                                    />
                                }
                                {user.bio}
                            </p>
                        </React.Fragment>
                    }
                </div>

            </div>
            <div>

            </div>
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
