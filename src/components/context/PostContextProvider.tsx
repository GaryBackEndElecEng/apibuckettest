"use client"
import axios from "axios";
import React from 'react';
import type { msgType, userType, contactType, postType, fileType, inputType, } from "@lib/Types";
import { getErrorMessage } from "@lib/errorBoundaries";
const base_url = process.env.NEXT_PUBLIC_baseurl;


type postContextType = {

    setPostMsg: React.Dispatch<React.SetStateAction<msgType>>,
    postMsg: msgType,
    setPost: React.Dispatch<React.SetStateAction<postType | undefined>>,
    post: postType | undefined,
    setPosts: React.Dispatch<React.SetStateAction<postType[]>>,
    posts: postType[],
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>,
    uploaded: boolean,



}
export const PostContext = React.createContext<postContextType>({} as postContextType);

const PostContextProvider = (props: any) => {

    const [postMsg, setPostMsg] = React.useState<msgType>();
    const [uploaded, setUploaded] = React.useState<boolean>(false)
    const [posts, setPosts] = React.useState<postType[]>([]);
    const [post, setPost] = React.useState<postType>();



    return (
        <PostContext.Provider value={{ setPost, post, uploaded, setUploaded, postMsg, setPostMsg, setPosts, posts }}>
            {props.children}
        </PostContext.Provider>
    )
}

export default PostContextProvider

export const usePostContext = () => React.useContext(PostContext);