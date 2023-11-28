"use client"

import React from 'react';
import type { msgType, pageHitType, fileLikeType, fileRateType, fileType, inputType, } from "@lib/Types";
import { getErrorMessage } from "@lib/errorBoundaries";
const base_url = process.env.NEXT_PUBLIC_baseurl;


type blog_ContextType = {
    setMessage: React.Dispatch<React.SetStateAction<msgType | undefined>>,
    message: msgType | undefined,
    setGeneralMsg: React.Dispatch<React.SetStateAction<msgType | undefined>>,
    generalMsg: msgType | undefined,
    setBlogMsg: React.Dispatch<React.SetStateAction<msgType>>,
    blogMsg: msgType,
    setInput: React.Dispatch<React.SetStateAction<inputType | undefined>>
    input: inputType | undefined,
    setInput_s: React.Dispatch<React.SetStateAction<inputType[] | undefined>>
    input_s: inputType[] | undefined,
    setFile_: React.Dispatch<React.SetStateAction<fileType | undefined>>,
    file_: fileType | undefined,
    setUserBlogs: React.Dispatch<React.SetStateAction<fileType[]>>,
    userBlogs: fileType[],
    setFileLikes: React.Dispatch<React.SetStateAction<fileLikeType[]>>,
    fileLikes: fileLikeType[],
    setFileRates: React.Dispatch<React.SetStateAction<fileRateType[]>>,
    fileRates: fileRateType[],


}
export const BlogContext = React.createContext<blog_ContextType>({} as blog_ContextType);

const BlogContextProvider = (props: any) => {

    const [blogMsg, setBlogMsg] = React.useState<msgType>();
    const [input, setInput] = React.useState<inputType>();
    const [file_, setFile_] = React.useState<fileType>();
    const [file_s, setFile_s] = React.useState<fileType[]>([]);
    const [input_s, setInput_s] = React.useState<inputType[]>();
    const [generalMsg, setGeneralMsg] = React.useState<msgType>();
    const [message, setMessage] = React.useState<msgType>();
    const [userBlogs, setUserBlogs] = React.useState<fileType[]>([]);
    const [fileRates, setFileRates] = React.useState<fileRateType[]>([]);
    const [fileLikes, setFileLikes] = React.useState<fileLikeType[]>([]);



    return (
        <BlogContext.Provider value={{ blogMsg, setBlogMsg, input, setInput, file_, setFile_, setInput_s, input_s, userBlogs, setUserBlogs, generalMsg, setGeneralMsg, message, setMessage, fileLikes, setFileLikes, fileRates, setFileRates }}>
            {props.children}
        </BlogContext.Provider>
    )
}

export default BlogContextProvider;

export const useBlogContext = () => React.useContext(BlogContext)