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
    setPageHit: React.Dispatch<React.SetStateAction<pageHitType | undefined>>,
    pageHit: pageHitType | undefined,
    setGetError: React.Dispatch<React.SetStateAction<string>>,
    getError: string
    setContact: React.Dispatch<React.SetStateAction<contactType>>,
    contact: contactType,
    setGenInfo: React.Dispatch<React.SetStateAction<generalInfoType[]>>,
    genInfo: generalInfoType[],


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
    const [pageHit, setPageHit] = React.useState<pageHitType | undefined>();

    const [genInfo, setGenInfo] = React.useState<generalInfoType[]>([]);
    const [contact, setContact] = React.useState<contactType>({} as contactType);
    const [getError, setGetError] = React.useState<string>("");






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

        // getGenInfo();

    }, []);



    return (
        <GeneralContext.Provider value={{ msg, setMsg, clients, setClients, setPageHit, pageHit, client, setClient, contact, setContact, genInfo, setGenInfo, getError, setGetError, user, setUser }}>
            {props.children}
        </GeneralContext.Provider>
    )
}

export default GeneralContextProvider;

export const useGeneralContext = () => React.useContext(GeneralContext)