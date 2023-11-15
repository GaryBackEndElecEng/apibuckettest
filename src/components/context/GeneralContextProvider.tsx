"use client"
import axios from "axios";
import React from 'react';
import type { msgType, userType, pageHitType, contactType, postType, generalInfoType, } from "@lib/Types";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { getErrorMessage } from "@lib/errorBoundaries";
const base_url = process.env.NEXT_PUBLIC_baseurl;


type generalContextType = {

    setMsg: React.Dispatch<React.SetStateAction<msgType>>,
    msg: msgType,
    setUsers: React.Dispatch<React.SetStateAction<userType[]>>,
    users: userType[],
    setUser: React.Dispatch<React.SetStateAction<userType | null>>
    user: userType | null,
    setPageHit: React.Dispatch<React.SetStateAction<pageHitType | undefined>>,
    pageHit: pageHitType | undefined,
    setPost: React.Dispatch<React.SetStateAction<postType>>,
    post: postType,
    setGetError: React.Dispatch<React.SetStateAction<string>>,
    getError: string
    setContact: React.Dispatch<React.SetStateAction<contactType>>,
    contact: contactType,
    setGenInfo: React.Dispatch<React.SetStateAction<generalInfoType[]>>,
    genInfo: generalInfoType[]

}
export const GeneralContext = React.createContext<generalContextType>({} as generalContextType);

const GeneralContextProvider = (props: any) => {

    const [isSignin, setIsSignin] = React.useState<boolean>(false);
    const [msg, setMsg] = React.useState<msgType>({ loaded: false, msg: "" })
    const [users, setUsers] = React.useState<userType[]>([]);
    const [user, setUser] = React.useState<userType | null>(null);
    const [client, setClient] = React.useState<userType | null>(null);
    const [allUsers, setAllUsers] = React.useState<userType[]>([]);
    const [genMsg, setGenMsg] = React.useState<msgType>({ loaded: false, msg: "" })
    const [userId, setUserId] = React.useState<string | null>(null);


    const [signup, setSignup] = React.useState<boolean>(false);
    const [pageHit, setPageHit] = React.useState<pageHitType | undefined>();

    const [genInfo, setGenInfo] = React.useState<generalInfoType[]>([]);
    const [contact, setContact] = React.useState<contactType>({} as contactType);
    const [posts, setPosts] = React.useState<postType[]>([]);
    const [post, setPost] = React.useState<postType>({} as postType);
    const [getError, setGetError] = React.useState<string>("");



    React.useEffect(() => {
        const recordHit = async () => {
            if (!pageHit) return
            try {
                await axios.post(`/api/pagehit`, pageHit);
                //components
            } catch (error) {
                let message: string = `${getErrorMessage(error)}@api/page-hit`
                setGetError(message)
                return console.error(message)
            }
        }
        if (pageHit) {
            recordHit();
        }
    }, [pageHit]);

    React.useEffect(() => {
        const getGenInfo = async () => {

            try {
                const { data } = await axios.get(`/api/geninfo`);
                //components
                const body: generalInfoType[] = await data as generalInfoType[];

                setGenInfo(body);
            } catch (error) {
                let message: string = `${getErrorMessage(error)}@api/genInfo`
                setGetError(message)
                return console.log(message)
            }
        }

        getGenInfo();

    }, []);
    React.useEffect(() => {
        const getGenInfo = async () => {

            try {
                const { data } = await axios.get(`/api/getposts`);
                //components
                const body: postType[] = await data as postType[];

                setPosts(body);
            } catch (error) {
                let message: string = `${getErrorMessage(error)}@api/generalInfo`
                setGetError(message)
                return console.log(message)
            }
        }

        getGenInfo();

    }, []);


    return (
        <GeneralContext.Provider value={{ msg, setMsg, users, setUsers, setPageHit, pageHit, user, setUser, contact, setContact, setPost, post, genInfo, setGenInfo, getError, setGetError }}>
            {props.children}
        </GeneralContext.Provider>
    )
}

export default GeneralContextProvider