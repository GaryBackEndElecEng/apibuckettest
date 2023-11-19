"use client"
import axios from "axios";
import React from 'react';
import type { msgType, userType, pageHitType, contactType, postType, generalInfoType, fileType, } from "@lib/Types";
import { useSession } from "next-auth/react";
import { getErrorMessage } from "@lib/errorBoundaries";
const base_url = process.env.NEXT_PUBLIC_baseurl;


type dashboardContextType = {

    setMsg: React.Dispatch<React.SetStateAction<msgType>>,
    msg: msgType,
    setUser: React.Dispatch<React.SetStateAction<userType>>
    user: userType,
    setPost: React.Dispatch<React.SetStateAction<postType>>,
    post: postType,
    setContact: React.Dispatch<React.SetStateAction<contactType>>,
    contact: contactType,
    setFile: React.Dispatch<React.SetStateAction<fileType>>,
    file: fileType,
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>,
    uploaded: boolean,


}
export const DashboardContext = React.createContext<dashboardContextType>({} as dashboardContextType);

const DashboardContextProvider = (props: any) => {

    const [isSignin, setIsSignin] = React.useState<boolean>(false);
    const [msg, setMsg] = React.useState<msgType>({ loaded: false, msg: "" });
    const [uploaded, setUploaded] = React.useState<boolean>(false)
    const [user, setUser] = React.useState<userType>({} as userType);
    const [genMsg, setGenMsg] = React.useState<msgType>({ loaded: false, msg: "" })
    const [userId, setUserId] = React.useState<string | null>(null);

    const [contact, setContact] = React.useState<contactType>({} as contactType);
    const [file, setFile] = React.useState<fileType>({} as fileType);
    const [posts, setPosts] = React.useState<postType[]>([]);
    const [post, setPost] = React.useState<postType>({} as postType);



    return (
        <DashboardContext.Provider value={{ msg, setMsg, user, setUser, contact, setContact, setPost, post, file, uploaded, setUploaded, setFile }}>
            {props.children}
        </DashboardContext.Provider>
    )
}

export default DashboardContextProvider

export const useDashboardContext = () => React.useContext(DashboardContext);