import React from 'react';
import type { userType } from "@lib/Types";
import { GeneralContext } from '@context/GeneralContextProvider';
import { Button } from "@chakra-ui/react";
import Image from 'next/image';
// import { saveUser } from "@lib/fetchTypes";
import { v4 as uuidv4 } from "uuid";


type mainType = {
    setData: React.Dispatch<React.SetStateAction<userType>>,
    Data: userType
}
export default function UploadDisplayPic({ Data, setData }: mainType) {
    const imgKey = (Data && Data.imgKey) ? Data.imgKey : null;
    const imageUrl = (Data && Data.image) ? Data.image : undefined
    const { setUser, setMsg, msg } = React.useContext(GeneralContext);
    const [Key, setKey] = React.useState<string | null>(imgKey);
    const [s3Image, setS3Image] = React.useState<string | undefined>(imageUrl);
    const [tempImg, setTempImg] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, Data: userType) => {
        e.preventDefault();
        if (!Data) return
        setIsLoading(true)

        try {
            const res = await fetch(`/api/media?Key=${Data.imgKey}`);
            const body: s3mediaType = await res.json();
            console.log("BODY", body)
            setTempImg(body.url);
        } catch (error) {

        }
        setMsg({ loaded: true, msg: "uploaded" })

        setIsLoading(false)


    }

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.currentTarget.files) return
        const fileImg = e.currentTarget.files[0]
        const username = Data.name as string
        const genKey = `${uuidv4().split("-")[0]}-${username?.trim().replace(" ", "-")}-${fileImg.name}`
        const formdata = new FormData();
        formdata.set("file", fileImg);
        formdata.set("Key", genKey);
        setData({ ...Data, imgKey: genKey });
        setKey(genKey);


        try {
            const res = await fetch(`/api/uploadImage`, {
                method: "PUT",
                body: formdata
            });
            if (res.ok) {
                return setMsg({ loaded: true, msg: "Saved" })
            }
        } catch (error) {

        }
        //inserting temp img
        const tempImg_ = URL.createObjectURL(fileImg);
        setTempImg(tempImg_)

    }
    const cirImage = "border border-white shadow shadow-blue-300 p-1 rounded-full"

    return (
        <div className="flex flex-col items-start justify-evenly w-full">
            <form action="" onSubmit={(e) => handleSubmit(e, Data)}
                className="flex flex-row flex-wrap justify-around items-center gap-3 text-xs"
            >
                <label htmlFor="file" className="text-xs">pic upload</label>
                <input
                    id="file"
                    type="file"
                    name="file"
                    required
                    accept="image/png image/jpeg image/jpg"
                    onChange={onFileChange}
                />
                <div>
                    {msg.loaded ? (
                        <h3 className="text-blue-800 font-bold text-center">{msg.msg}</h3>
                    ) : (<h3 className="text-orange-800 font-bold text-center">{msg.msg}</h3>)}
                </div>
                <Button isLoading={isLoading} colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label px-3 rounded-full" type="submit" isDisabled={isLoading}  >up load</Button>

                <Button as={"label"} htmlFor="file" colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label opacity-0"   >choose file</Button>
            </form>

            <div className="flex flex-col justify-center items-center mt-2">
                {tempImg &&
                    (
                        <Image src={tempImg} width={75} height={75} alt="www.garymasterconnect.ca" className={cirImage} />
                    )

                }
            </div>
        </div>
    )
}
