import type { contactType, msgType, userType } from '@/lib/Types'
import React from 'react';
import { TextField } from '@mui/material'
import { getErrorMessage } from '@/lib/errorBoundaries';
import styles from "./dashboard.module.css"
import { useGeneralContext } from '../context/GeneralContextProvider';
import toast from 'react-hot-toast';


type fetchContactType = {
    contact: contactType,
    message: string
}
type mainType = {
    setContactBtn: React.Dispatch<React.SetStateAction<boolean>>,
    contactBtn: boolean,
    user: userType | null,
    setMsg: React.Dispatch<React.SetStateAction<msgType>>,
}
export default function MemberContact({ user, setContactBtn, contactBtn, setMsg }: mainType) {
    const { contact, setContact } = useGeneralContext()

    const handleSend = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (contact && user) {
            let sendContact = { ...contact, userId: user.id, email: user.email }
            try {
                const res = await fetch("/api/contact", {
                    method: "POST",
                    body: JSON.stringify(sendContact)
                });
                const body: fetchContactType = await res.json();
                setMsg({ loaded: true, msg: `${body.message}. We will answer you ASAP!` });
                setContactBtn(false);
                setContact({} as contactType)
                toast.success("recieved message");
            } catch (error) {
                const msg = getErrorMessage(error);
                setMsg({ loaded: false, msg })
                console.error(`${msg}@GenContact@gencontact@footer`)
                toast.error("something went wrong")
            }
        }
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        if (e.target) {
            setContact(
                {
                    ...contact,
                    [e.target.name]: e.target.value
                }
            )
        }
    }
    return (
        <div className={contactBtn ? styles.contactContainer : styles.closeContactContainer}>
            <h3 className="text-center text-lg my-2 text-black">MEMBER CONTACT</h3>
            <form>
                <TextField
                    fullWidth={true}
                    helperText={`subject`}
                    id={`subject}`}
                    label={`subject`}
                    multiline={false}
                    name={`subject`}
                    placeholder={`subject`}
                    required
                    size={"medium"}
                    type="text"
                    value={contact.subject ? contact.subject : ""}
                    onChange={(e) => handleOnChange(e)}
                    style={{ fontFamily: "bold" }}
                />

                <TextField
                    fullWidth={true}
                    helperText={`content`}
                    id={`content}`}
                    label={`content`}
                    multiline={true}
                    minRows={4}
                    name={`content`}
                    placeholder={`content`}
                    required
                    size={"medium"}
                    type="text"
                    value={contact.content ? contact.content : ""}
                    onChange={(e) => handleOnChange(e)}
                    style={{ fontFamily: "bold" }}
                />
                <div className="flex flex-col justify-center items-center gap-2">
                    <button className={styles.contactSendBtn} onClick={(e) => handleSend(e)}>send</button>
                </div>
            </form>
            <div className="flex flex-col justify-center items-center gap-2">

                <button className={styles.contactSendBtn} onClick={() => setContactBtn(false)}>close</button>
            </div>
        </div>
    )
}
