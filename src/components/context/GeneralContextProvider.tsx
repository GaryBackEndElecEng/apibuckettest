"use client"
import axios from "axios";
import React from 'react';
import type { msgType, userType, pageHitType, contactType, postType, generalInfoType, fileType, } from "@lib/Types";
import { useSession } from "next-auth/react";
import { getErrorMessage } from "@lib/errorBoundaries";
const base_url = process.env.NEXT_PUBLIC_baseurl;


type generalContextType = {

    setMsg: React.Dispatch<React.SetStateAction<msgType>>,
    msg: msgType,
    setClients: React.Dispatch<React.SetStateAction<userType[]>>,
    clients: userType[],
    setClient: React.Dispatch<React.SetStateAction<userType | null>>
    client: userType | null,
    setUser: React.Dispatch<React.SetStateAction<userType | null>>
    user: userType | null,
    setPageHits: React.Dispatch<React.SetStateAction<pageHitType[]>>,
    pageHits: pageHitType[],
    setGetError: React.Dispatch<React.SetStateAction<string>>,
    getError: string
    setContact: React.Dispatch<React.SetStateAction<contactType>>,
    contact: contactType,
    setGenInfo: React.Dispatch<React.SetStateAction<generalInfoType[]>>,
    genInfo: generalInfoType[],
    setPageChange: React.Dispatch<React.SetStateAction<boolean>>,
    pageChange: boolean


}
type fetchPageHits = {
    pageHits: pageHitType[],
    message: string
}
export const GeneralContext = React.createContext<generalContextType>({} as generalContextType);

const GeneralContextProvider = (props: any) => {

    const [isSignin, setIsSignin] = React.useState<boolean>(false);
    const [msg, setMsg] = React.useState<msgType>({ loaded: false, msg: "" })
    const [client, setClient] = React.useState<userType | null>(null);
    const [user, setUser] = React.useState<userType | null>(null);
    const [clients, setClients] = React.useState<userType[]>([]);
    const [genMsg, setGenMsg] = React.useState<msgType>({ loaded: false, msg: "" })
    const [clientId, setClientId] = React.useState<string | null>(null);
    const [signup, setSignup] = React.useState<boolean>(false);
    const [pageHits, setPageHits] = React.useState<pageHitType[]>([]);

    const [genInfo, setGenInfo] = React.useState<generalInfoType[]>([]);
    const [contact, setContact] = React.useState<contactType>({} as contactType);
    const [getError, setGetError] = React.useState<string>("");
    const [pageChange, setPageChange] = React.useState<boolean>(false);

    React.useEffect(() => {
        const getPageHits = async () => {
            const controller = new AbortController();
            try {
                const res = await fetch(`/api/pagehit`, {
                    signal: controller.signal
                });

                //components
                if (res.ok) {
                    const body: fetchPageHits = await res.json();
                    setPageHits(body.pageHits);
                    setMsg({ loaded: true, msg: body.message })
                }
                return () => controller.abort();
            } catch (error) {
                let message: string = `${getErrorMessage(error)}@api/genInfo`
                setMsg({ loaded: false, msg: message })
                return console.log(message)
            }
        }

        getPageHits();

    }, []);



    return (
        <GeneralContext.Provider value={{ msg, setMsg, clients, setClients, setPageHits, pageHits, client, setClient, contact, setContact, genInfo, setGenInfo, getError, setGetError, user, setUser, pageChange, setPageChange }}>
            {props.children}
        </GeneralContext.Provider>
    )
}

export default GeneralContextProvider;

export const useGeneralContext = () => React.useContext(GeneralContext)