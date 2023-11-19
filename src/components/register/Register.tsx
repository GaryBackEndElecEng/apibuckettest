
import React, { FormEvent } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { userType, msgType } from "@lib/Types";
import styles from "@component/register/register.module.css";
import Link from 'next/link';
import axios from 'axios';
import { genHash } from "@lib/ultils"
import { Button } from '@mui/material';
import GenMsg from "@component/register/GenMsg";
import UploadImg from "@component/register/UploadImg";
import DashboardComtextProvider, { useDashboardContext } from '../context/DashBoardContextProvider';

type resType = { user: string | undefined, message: string | undefined, status: number }

export default function Register() {
    const router = useRouter();
    const { setUser, uploaded, setUploaded } = useDashboardContext();
    const logo = `/images/gb_logo.png`;
    let bool: boolean | null = null;
    let tempUser: userType | null = null;

    //setUploaded is not a function=>find a way without converting the whole page to a client
    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const getPswd = formData.get("password");
        const isPswd = textPswd(getPswd as string);
        bool = isPswd;
        bool = false;
        const res = await fetch("/api/register", {
            method: "POST",
            body: formData
        });
        const body = await res.json() as resType
        if (body.status === 200) {
            // const getUser = JSON.parse(body.user as string)//no need
            alert(body.message)
            router.push("/api/auth/signin")
            //GET USER USER FROM EMAIL AND LOAD SETUSER()

        } else {
            alert(`something went wrong!!${body.message}`)
        }

    }


    return (

        <div className={styles.masterReg}>
            <div className={styles.masterSubReg}>
                <div className="sm:mx-auto px-8 sm:max-w-sm">
                    <Image width={155} height={155} src={logo} alt="www" priority />
                    <h2 >Register</h2>
                    <h3 >Thank you for being with us</h3>

                </div>
                <div className={styles.breakLine} />
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={onSubmit} id="formdata" className={styles.form} >

                        <label htmlFor="name" className="block text-sm font-medium leading-6">name</label>

                        <input type="text" className="mt-2 shadow shadow-blue bg-white text-black rounded-lg w-full px-3"
                            name="name"
                            id="name"
                            required

                        />

                        <label htmlFor="email" className="block text-sm font-medium leading-6">email</label>

                        <input className="mt-2 shadow shadow-blue bg-white text-black rounded-lg  w-full px-3"
                            name="email"
                            id="email"
                            type="email"
                            required

                        />

                        <label htmlFor="password" >password</label>
                        <div >
                            <input
                                name="password"
                                id="password"
                                type="password"
                                required
                                minLength={5}
                            />
                            <div>
                                <label htmlFor="showPswd" >show</label>
                                <input
                                    name="showPswd"
                                    id="showPswd"
                                    type="checkbox"
                                    onClick={showPswd}

                                />
                            </div>
                        </div>


                        <div className="flex flex-col items-center">
                            <button type="submit" >submit</button>
                        </div>
                    </form>
                    <div className={styles.link}>
                        <Link href={"/api/auth/signin"}

                        >
                            <Button> signin</Button>
                        </Link>
                    </div>
                </div>
                <div className={styles.breakLine} />
            </div>
        </div>


    )
}





export async function showPswd(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    const x_: HTMLInputElement | null = document.getElementById("password") as HTMLInputElement;
    // console.log("EEEVENT", e.currentTarget.value)
    if (x_) {
        if (x_.type === "password") {
            x_.type = "text"
            e.currentTarget.value = "true"
        } else {
            x_.type = "password";
            e.currentTarget.value = "false"
        }
    }
    return e.currentTarget.value

}
function textPswd(pswd: string) {
    const pswdTest = /(?=^.{4,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g;
    if (pswdTest.test(pswd)) {
        return true
    } else {
        return false
    }

}
