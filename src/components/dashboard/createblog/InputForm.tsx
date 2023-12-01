import React from 'react'
import styles from "@component/dashboard/createblog/createablog.module.css";
import "@pages/globalsTwo.css"
import { TextField } from '@mui/material';
import { inputType, userType } from '@/lib/Types';
import { useBlogContext } from '@/components/context/BlogContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { v4 as uuidv4 } from "uuid";
import { SecPlusForm, HeaderPlusForm, ImgForm } from "@component/compForms/formInputs";

type fetchType = {
    input: inputType,
    message: string
}
type inputFormType = {
    // setInput:React.Dispatch<React.SetStateAction<inputType>>,
    input: inputType,
    setImgLoaded: React.Dispatch<React.SetStateAction<boolean>>,
    imgLoaded: boolean,
    user: userType | null,
    fileId: string | undefined,
    setIsSelected: React.Dispatch<React.SetStateAction<boolean>>,
    setInput: React.Dispatch<React.SetStateAction<inputType | undefined>>

};
//-------------THIS IS LOOPED!!-----------------//
export default function InputForm({ input, setInput, imgLoaded, setImgLoaded, user, setIsSelected }: inputFormType) {
    const { setInput_s, input_s, setBlogMsg } = useBlogContext();




    const handleSaveInput = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        //SEND SERVER=> update inputs, then NULLIFY INPUT


        try {
            const res = await fetch("/api/input", {
                method: "PUT",
                body: JSON.stringify(input)
            });
            const body: fetchType = await res.json();
            if (res.ok && input_s) {
                const reduce = input_s.filter(inp => (inp.id !== input.id));
                setInput_s([...reduce, body.input]);
                setInput(undefined);
                setBlogMsg({ loaded: true, msg: body.message });
                setIsSelected(false);
                return
            } else if (res.status > 200 && res.status < 500) {
                setBlogMsg({ loaded: false, msg: body.message });
                return
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@input`);
            setBlogMsg({ loaded: false, msg: `${message}@input` });
            return
        }
    }

    return (
        <div className={`${styles.mainInputForm} bg-slate-200`}>
            <GenForm
                user={user}
                setInput={setInput}
                setImgLoaded={setImgLoaded}
                input={input}

            />
            <button className={styles.inputFormButton} onClick={(e) => handleSaveInput(e)}>
                save
            </button>
        </div>

    )

};

type GenFormType = {
    setInput: React.Dispatch<React.SetStateAction<inputType | undefined>>,
    setImgLoaded: React.Dispatch<React.SetStateAction<boolean>>,
    user: userType | null,
    input: inputType | undefined
};

export function GenForm({ setInput, input, setImgLoaded, user }: GenFormType) {
    const { setBlogMsg, } = useBlogContext();


    //NOTE: CORRECT INPUT VALUE=> CAN'T INVOKE TEXT
    if (input) {

        return (
            <>
                <SecPlusForm input={input} setInput={setInput} />
                <HeaderPlusForm input={input} setInput={setInput} />
                <ImgForm
                    input={input}
                    setInput={setInput}
                    user={user}
                    setImgLoaded={setImgLoaded}
                    setBlogMsg={setBlogMsg}
                />
            </>
        )
    }
};
