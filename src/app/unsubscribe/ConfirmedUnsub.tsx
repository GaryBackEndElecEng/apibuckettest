"use client";
import { contactType } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import React from 'react'

type contType = {
    contact: contactType,
    message: string
}
export default function ConfirmedUnsub({ email }: { email: string }) {
    const [confirmed, setComfirmed] = React.useState<{ loaded: boolean, email: string }>({ loaded: false, email: "" });

    const handleSubmit = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/contact$email=${email}`, { method: "DELETE" });
            if (res.ok) {
                const body: contType = await res.json();
                setComfirmed({ loaded: true, email: body.contact.email });
            }
        } catch (error) {
            const msg = getErrorMessage(error);
            console.error(`${msg}@Confirmed@contact`)
        }
    }
    return (
        <div className="mx-auto px-1">
            <div className="text-center text-xl" onClick={(e) => handleSubmit(e)}> click to unsubscribe</div>
            {confirmed.loaded &&
                <React.Fragment>
                    <h3 className="text-center text-xl"> your contact has been deleted from our database.</h3>
                    <h4 className="text-center text-xl"> Thank-you for participating,,, we appreciate your requests.</h4>
                    <h4 className="text-center text-xl"> Have a Great day!</h4>

                </React.Fragment>
            }
        </div>
    )
}
