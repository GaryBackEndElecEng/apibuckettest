import React from 'react'
import styles from "@component/dashboard/createblog/createablog.module.css";
import "@pages/globalsTwo.css"
import { TextField } from '@mui/material';
import { inputType, userType } from '@/lib/Types';
import { useBlogContext } from '@/components/context/BlogContextProvider';
import { getErrorMessage } from '@/lib/errorBoundaries';
import { v4 as uuidv4 } from "uuid";
import { SecPlusForm, HeaderPlusForm, ImgForm, LinkForm, ReplyForm, ListForm, CodeForm, FormStyleList } from "@component/compForms/formInputs";
import toast from 'react-hot-toast';

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
    const [inputsLen, setInputsLen] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (input_s) {
            setInputsLen(input_s.map(input => input.order as number));
        }
    }, [input_s]);


    const handleSaveInput = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        //SEND SERVER=> update inputs, then NULLIFY INPUT
        // console.log("Ln:42@inputForm", input_s)

        try {
            const res = await fetch("/api/input", {
                method: "PUT",
                body: JSON.stringify(input)
            });
            const body: fetchType = await res.json();
            if (input_s) {
                const reduce = input_s.filter(inp => (inp.id !== input.id));
                setInput_s([...reduce, body.input]);
                setInput(undefined);
                // setBlogMsg({ loaded: true, msg: body.message });
                toast.success(`saved: ${body.message}`);
                setIsSelected(false);
                return
            } else if (res.status > 200 && res.status < 500) {
                // setBlogMsg({ loaded: false, msg: body.message });
                toast.error("updated - refresh the page")
                return
            }
        } catch (error) {
            const message = getErrorMessage(error);
            console.error(`${message}@input`);
            // setBlogMsg({ loaded: false, msg: `${message}@input` });
            toast.error(`something went wrong- did not save`)
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
                inputsLen={inputsLen}

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
    input: inputType | undefined,
    inputsLen: number[]
};

export function GenForm({ setInput, input, setImgLoaded, user, inputsLen }: GenFormType) {
    const { setBlogMsg, } = useBlogContext();


    //NOTE: CORRECT INPUT VALUE=> CAN'T INVOKE TEXT
    if (input) {

        return (
            <>
                <SecPlusForm input={input} setInput={setInput} inputsLen={inputsLen} />
                <HeaderPlusForm input={input} setInput={setInput} inputsLen={inputsLen} />
                <ImgForm
                    input={input}
                    setInput={setInput}
                    user={user}
                    setImgLoaded={setImgLoaded}
                    setBlogMsg={setBlogMsg}
                    inputsLen={inputsLen}
                />
                <LinkForm input={input} setInput={setInput} inputsLen={inputsLen} />
                <ListForm input={input} setInput={setInput} inputsLen={inputsLen} />
                <CodeForm input={input} setInput={setInput} inputsLen={inputsLen} />
                <ReplyForm input={input} setInput={setInput} inputsLen={inputsLen} />
                <FormStyleList input={input} setInput={setInput} inputsLen={inputsLen} />
            </>
        )
    }
};
