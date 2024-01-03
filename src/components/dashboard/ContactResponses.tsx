"use client";
import { contactType, userType } from '@/lib/Types'
import { getErrorMessage } from '@/lib/errorBoundaries';
import React from 'react'

type fetchContType = {
    contacts: contactType[],
    message: string
}
export default function ContactResponses({ user }: { user: userType | null }) {
    const [getContacts, setGetContacts] = React.useState<contactType[]>([]);

    React.useEffect(() => {
        if (!user) return
        if (user.id) {
            const getUserContacts = async () => {
                try {
                    const res = await fetch(`/api/usercontacts?userId=${user.id}`)
                    const body: fetchContType = await res.json();
                    setGetContacts(body.contacts);
                } catch (error) {
                    const msg = getErrorMessage(error);
                    console.error(`${msg}@Dashboard@ContactResponse@getContacts`);
                }
            }
            getUserContacts();
        }
    }, [user])
    return (
        <React.Fragment>
            <h3 className="text-center font-bold">contact responses</h3>
            <div className="flex flex-col w-full px-1 mx-auto h-[15vh] overflow-y-scroll">
                {
                    getContacts && getContacts.map((contact, index) => (
                        <div className="mx-auto" key={index}>
                            <h4>{contact.subject}</h4>
                            <p>{contact.content}</p>
                            <small>{contact.email}</small>
                        </div>
                    ))
                }
            </div>
        </React.Fragment>
    )
}
