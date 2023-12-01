"use client"
import axios from "axios";
import React from 'react';
import type { msgType, userType, contactType, postType, fileType, inputType, postLikeType, postRateType, blogLinkType, } from "@lib/Types";
import { getErrorMessage } from "@lib/errorBoundaries";
const base_url = process.env.NEXT_PUBLIC_baseurl;


type postContextType = {

    setPostMsg: React.Dispatch<React.SetStateAction<msgType>>,
    postMsg: msgType,
    setPost: React.Dispatch<React.SetStateAction<postType | undefined>>,
    post: postType | undefined,
    setPosts: React.Dispatch<React.SetStateAction<postType[]>>,
    posts: postType[],
    setUserPosts: React.Dispatch<React.SetStateAction<postType[]>>,
    userPosts: postType[],
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>,
    uploaded: boolean,
    setPostLikes: React.Dispatch<React.SetStateAction<postLikeType[]>>,
    postLikes: postLikeType[],
    setPostRates: React.Dispatch<React.SetStateAction<postRateType[]>>,
    postRates: postRateType[],
    setLikes: React.Dispatch<React.SetStateAction<postLikeType[]>>,
    likes: postLikeType[],
    setBlogLinks: React.Dispatch<React.SetStateAction<blogLinkType[]>>,
    blogLinks: blogLinkType[]




}
export const PostContext = React.createContext<postContextType>({} as postContextType);

const PostContextProvider = (props: any) => {

    const [postMsg, setPostMsg] = React.useState<msgType | undefined>();
    const [uploaded, setUploaded] = React.useState<boolean>(false)
    const [posts, setPosts] = React.useState<postType[]>([]);
    const [userPosts, setUserPosts] = React.useState<postType[]>([]);
    const [post, setPost] = React.useState<postType>();
    const [postLikes, setPostLikes] = React.useState<postLikeType[]>([]);
    const [likes, setLikes] = React.useState<postLikeType[]>([]);
    const [postRates, setPostRates] = React.useState<postRateType[]>([]);
    const [blogLinks, setBlogLinks] = React.useState<blogLinkType[]>([]);



    return (
        <PostContext.Provider value={{ setPost, post, uploaded, setUploaded, postMsg, setPostMsg, setPosts, posts, userPosts, setUserPosts, postRates, setPostRates, postLikes, setPostLikes, likes, setLikes, blogLinks, setBlogLinks }}>
            {props.children}
        </PostContext.Provider>
    )
}

export default PostContextProvider

export const usePostContext = () => React.useContext(PostContext);