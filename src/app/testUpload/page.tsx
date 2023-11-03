"use client";
import React, { ErrorInfo } from 'react';
import axios from "axios";


export default function TestPage() {

    const handleOnSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = await uploadFile(e)
        console.log(body)

    };
    return (
        <div className="lg:container mx-auto prose prose-md">
            <h3 className="text-center text-xl font-bold"> upload file</h3>
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
        </div>
    )
}

export async function uploadFile(e: React.ChangeEvent<HTMLFormElement>) {
    const formdata = new FormData(e.currentTarget);
    const file: File | null = formdata.get("file") as File;
    if (!file) return null
    const fileType: string = file?.type.toString()
    try {
        const { data } = await axios.get(`/api/testmedia?fileType=${fileType}`);
        const { uploadUrl, Key } = data;
        // console.log(body, file)
        // if (body) {
        const res = await axios.put(uploadUrl, file)
        console.log(res.status)
        return { Key: Key, res: res.status }
        // }
    } catch (error) {
        console.error(new Error(" error occurred"))
    }
}

