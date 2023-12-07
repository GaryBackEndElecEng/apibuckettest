import { useBlogContext } from '@/components/context/BlogContextProvider'
import { inputType, inputNames, userType, targetType } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import React from 'react';
import GenBlogMsg from "@/components/dashboard/createblog/GenBlogMsg";
import Popup from "@component/dashboard/createblog/Popup";
import styles from "@component/dashboard/createblog/createablog.module.css";
import InputForm from "@component/dashboard/createblog/InputForm";
import GenInput from "@dashboard/createblog/GenInput";
import "@pages/globalsTwo.css"
import GenericMsg from "@component/comp/GenericMsg";
import { FaTrash } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";
import { IconButton } from "@mui/material";

type fetchInType = {
    input: inputType,
    message: string
}
type fetchInTypes = {
    inputs: inputType[],
    message: string
}
type MainInputsType = {
    fileId: string | undefined,
    user: userType | null
}
//NOTE SETUP GET INPUTS(FILEID)=>SETINPUTS() IN DASHBOARD FROM SERVER IN DASHBOARD USING GETSERVERSIDE.
//NOTE InputForm ( CREATES AND UPDATE INPUTS=>SAVE AND UPDATE(PUT))
export default function CreateInputs({ fileId, user }: MainInputsType) {
    const { input_s, setInput_s, setBlogMsg, blogMsg, setInput, input } = useBlogContext();
    const [imgLoaded, setImgLoaded] = React.useState<boolean>(false);
    const [selectType, setSelectType] = React.useState<string>("select");
    const [isSelected, setIsSelected] = React.useState<boolean>(false);
    const [isDeleted, setIsDeleted] = React.useState<targetType>({ loaded: false, id: null })

    React.useEffect(() => {
        const getInputs = async () => {
            try {
                const res = await fetch(`/api/input_s?fileId=${fileId}`);
                const body: fetchInTypes = await res.json()
                if (res.ok) {
                    setInput_s(body.inputs);
                    setBlogMsg({ loaded: true, msg: body.message })
                } else if (res.status > 200 && res.status < 500) {
                    setBlogMsg({ loaded: false, msg: body.message })
                }
            } catch (error) {
                const message = getErrorMessage(error);
                console.error(`${message}@inputs`);
                setBlogMsg({ loaded: false, msg: message })
            }
        }
        if (fileId) {
            getInputs();
        }
    }, [fileId, setInput_s, setBlogMsg]);



    const handleSelectInput = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //INITIAL INPUT ADDED----------------//
        const inputSelect: inputType | undefined = inputNames.find(select => (select.type === selectType));
        if (fileId && inputSelect) {
            const input_type = { ...inputSelect, fileId: fileId }

            if (input_type && input_s) {

                try {
                    const res = await fetch("/api/input", {
                        method: "POST",
                        body: JSON.stringify(input_type)
                    });
                    if (res.ok) {
                        const body: fetchInType = await res.json();
                        setInput_s([...input_s, body.input]);
                        setBlogMsg({ loaded: true, msg: body.message });
                        setInput(body.input);
                        setIsSelected(true)
                        return
                    }
                } catch (error) {
                    const message = getErrorMessage(error);
                    console.error(`${message}@input`)
                    return
                }
            }
        }


    }

    const handleEdit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, inp: inputType | undefined) => {
        e.preventDefault();
        if (inp) {
            setInput(inp);
            setIsSelected(true);
            setIsDeleted({ loaded: true, id: inp.id as number });
            setBlogMsg({ loaded: true, msg: "ready to edit" })

        } else {
            setBlogMsg({ loaded: false, msg: "No ID- not deleted" })
        }
    }

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number | undefined) => {
        e.preventDefault();

        if (id) {
            try {
                const res = await fetch(`/api/input?inputId=${id}`, { method: "DELETE" });
                const body: fetchInType = await res.json();
                if (res.ok) {
                    if (input_s) {
                        const reduce = input_s.filter(inpt => (inpt.id !== id));
                        setInput_s(reduce)
                        setBlogMsg({ loaded: true, msg: `${body.input.name}-${body.message}` });
                        setIsDeleted({ loaded: true, id: id });
                    }
                } else if (res.status > 200 && res.status < 500) {
                    setBlogMsg({ loaded: false, msg: `${body.input.name}-${body.message}` })
                }
            } catch (error) {
                const message = getErrorMessage(error);
                console.error(`${message}@input@GenInput@delete`)
            }
        } else {
            setBlogMsg({ loaded: false, msg: "No ID- not deleted" })
            console.log("ID not seen")
        }
    }
    return (
        <div className={styles.mainCreateInputs}>

            <div className={styles.mainSelectInput}>
                {input_s && input_s.map((inputDown, index) => {
                    const check: inputType | undefined = inputNames.find(obj => (obj.type === inputDown.type)) ? inputDown : undefined;
                    if (check) {
                        return (

                            <div key={index} className={styles.genInputContainer}>
                                {isDeleted.loaded && isDeleted.id === check.id && <GenericMsg setPostMsg={setBlogMsg} postMsg={blogMsg} />}
                                <div className={styles.editDeleteContainer}>
                                    <IconButton onClick={(e) => handleDelete(e, check.id)}
                                        className={styles.deleteInput}
                                    >
                                        <FaTrash
                                        />
                                    </IconButton>
                                    <IconButton onClick={(e) => handleEdit(e, check)}
                                        className={styles.editInput}
                                    >
                                        <MdEditSquare
                                        />
                                    </IconButton>
                                </div>
                                <GenInput
                                    input={check}
                                    setInput={setInput}
                                    setIsSelected={setIsSelected}
                                    setIsDeleted={setIsDeleted}
                                />
                            </div>

                        )
                    }

                })}
            </div>
            <div className={styles.mainSelectInput}>
                <GenBlogMsg />
                {blogMsg && <Popup trigger={imgLoaded} message={blogMsg.msg} />}

                <form className={!isSelected ? styles.showSelector : styles.hideSelector} onSubmit={handleSelectInput}
                >
                    <select
                        id={selectType}
                        name={selectType}
                        value={selectType}
                        onChange={(e) => setSelectType(e.target.value)}
                    >
                        {inputNames &&
                            inputNames.map((select, index) => (
                                <option
                                    value={select.type}
                                    key={index}
                                >
                                    {select.type}
                                </option>
                            ))
                        }
                    </select>
                    <button className={styles.btnSubmit}>select</button>
                </form>

                <div className={isSelected ? styles.showInputForm : styles.hideInputForm}>
                    {input && isSelected &&
                        <InputForm
                            setIsSelected={setIsSelected}
                            fileId={fileId}
                            user={user}
                            setInput={setInput}
                            imgLoaded={imgLoaded}
                            setImgLoaded={setImgLoaded}
                            input={input}
                        />
                    }
                </div>
            </div>
        </div>
    )
}
