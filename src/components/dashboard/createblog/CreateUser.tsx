"use client";
import React from 'react';
import type { userType, msgType } from '@lib/Types';
import { TextField, dividerClasses } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { genHash } from "@lib/ultils";
import Image from "next/image";
import CreateFile from "@/components/dashboard/createblog/CreateFile";


export default function CreateUser() {
    const [user, setUser] = React.useState<userType>({} as userType);
    const [message, setMessage] = React.useState<msgType>({} as msgType);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [password, setPassword] = React.useState<string>("");
    const mainStyle = " mx-auto px-2 py-2";
    const form = "flex flex-col gap-3 mx-auto";

    React.useEffect(() => {
        const handlePswd = async () => {
            let hash = await genHash(password);
            setUser({ ...user, password: hash })
        }
        if (password) {
            handlePswd();
        }
    }, [password]);

    const handleUser = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (user.name && user.password && user.imgKey) {
            try {
                const { data } = await axios.post("/api/user", user);
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
        if (e.target.files) {
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
        <React.Fragment>
            <div className={mainStyle}>
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
                        value={user ? user?.name : " "}
                        onChange={(e) => setUser({ ...user, name: e.target.value as string })}
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
                        value={user ? user?.email : " "}
                        onChange={(e) => setUser({ ...user, email: e.target.value as string })}
                    />
                    <TextField
                        fullWidth={false}
                        helperText={"password"}
                        id={"password"}
                        label={"password"}
                        multiline={false}
                        name={"password"}
                        placeholder="password"
                        required
                        size={"medium"}
                        type="password"
                        variant="filled"
                        value={password ? password : " "}
                        onChange={async (e) => {

                            setPassword(e.target.value)
                        }}
                    />
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
                        value={user ? user?.bio : " "}
                        onChange={(e) => {

                            setUser({ ...user, bio: e.target.value as string })
                        }}
                    />

                    {user.name && user.password && user.imgKey &&
                        <button className="rounded-full px-3 py-auto my-3 bg-slate-600 text-white" type="submit">submit user</button>
                    }
                </form>
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
                {loaded &&
                    <div className="flex flex-col items-center justify-center">
                        {user &&
                            <React.Fragment>
                                <div className="text-center text-xl mb-2">{user.name}</div>
                                <p className="text-md px-2 my-2">
                                    {user.image && <Image src={user.image}
                                        width={125}
                                        height={125}
                                        className="rounded-full shadow shadow-orange-600 float-left"
                                        alt="www"
                                    />}
                                    {user.bio}
                                </p>
                            </React.Fragment>
                        }
                    </div>
                }
            </div>
            <div>
                <CreateFile userId={user.id} />
            </div>
        </React.Fragment>
    )
}
