"use client";
import React, { ErrorInfo } from 'react';
import axios from "axios";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

type getType = { Key: string, imgUrl: string };

export default function TestPage() {
    const [img, setImg] = React.useState<string>("#");

    const handleOnSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body: getType | undefined = await uploadFile(e) as getType | undefined;
        if (body) {
            const { Key, imgUrl } = body;
            // console.log(Key)
            setImg(imgUrl)
        }

    };
    return (
        <div className="lg:container mx-auto prose prose-md">
            <h3 className="text-center text-xl font-bold"> upload file please</h3>
            <form action="" className="flex flex-col mx-auto w-full sm:w-3/4 lg:w/1/2" onSubmit={handleOnSubmit}>
                <input
                    type="file"
                    name="file"
                    required
                    accept="image/png image/jpg image/jpeg"
                />
                <div className="flex flex-col items-center justify-center">

                    <button className="button" type="submit">
                        submit
                    </button>
                </div>
            </form>
            <div className="flex flex-col w-1/2 mx-auto">
                <Image src={img} width={600} height={400}
                    className="aspect-video"
                    alt="www"
                />
            </div>
        </div>
    )
}

export async function uploadFile(e: React.ChangeEvent<HTMLFormElement>) {
    const formdata = new FormData(e.currentTarget);
    const file: File | null = formdata.get("file") as File;
    const genKey = `${uuidv4().split("-").slice(0, 2).join("")}-${file.name}`;
    formdata.set("Key", genKey)
    if (!file) return null
    try {

        const res = await axios.post(`/api/testmediav3`, formdata);
        if (res.status === 200) {

            const res = await fetch(`/api/getmedia?sendkey=${genKey}`)
            return await res.json()
        }

        // }
    } catch (error) {
        console.error(new Error(" error occurred"))
    }
}