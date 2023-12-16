"use client";
import { TextField } from '@mui/material'
import React from 'react'
import { useGeneralContext } from '../context/GeneralContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { genContactType } from '@/lib/Types';
import styles from "./footer.module.css"
import toast from 'react-hot-toast';

type fetchContactType = {
    contact: genContactType,
    message: string
}
type mainType = {
    setContactBtn: React.Dispatch<React.SetStateAction<boolean>>
}
export default function GenContact({ setContactBtn }: mainType) {
    const { genContact, setGenContact, setMsg, msg } = useGeneralContext()

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        if (e.target) {
            setGenContact(
                {
                    ...genContact,
                    [e.target.name]: e.target.value
                }
            )
        }
    }
    const handleSend = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (genContact) {
            try {
                const res = await fetch("/api/gencontact", {
                    method: "POST",
                    body: JSON.stringify(genContact)
                });
                const body: fetchContactType = await res.json();
                setMsg({ loaded: true, msg: body.message });
                setContactBtn(false);
                toast.success(`sent:${body.message}`);
            } catch (error) {
                const msg = getErrorMessage(error);
                setMsg({ loaded: false, msg })
                console.error(`${msg}@GenContact@gencontact@footer`)
                toast.error("something went wrong")
            }
        }
    }

    const button = "buttonsm bg-black text-white";
    return (
        <div className={styles.genContactContainer}>
            <h3 className="text-center text-lg my-2 text-black">CONTACT US</h3>
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
                    value={genContact.subject ? genContact.subject : ""}
                    onChange={(e) => handleOnChange(e)}
                    style={{ fontFamily: "bold" }}
                />
                <TextField
                    fullWidth={true}
                    helperText={`email`}
                    id={`email`}
                    label={`email`}
                    multiline={false}
                    name={`email`}
                    placeholder={`email`}
                    required
                    size={"medium"}
                    type="email"
                    value={genContact.email ? genContact.email : ""}
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
                    value={genContact.content ? genContact.content : ""}
                    onChange={(e) => handleOnChange(e)}
                    style={{ fontFamily: "bold" }}
                />
                <div className="flex flex-row justify-center items-center gap-2">
                    <button className={button} onClick={(e) => handleSend(e)}>send</button>
                    <button className={button} onClick={() => setContactBtn(false)}>close</button>
                </div>
            </form>
        </div>
    )
}
