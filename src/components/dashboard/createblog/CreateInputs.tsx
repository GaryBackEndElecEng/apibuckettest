import { useBlogContext } from '@/components/context/BlogContextProvider'
import { inputType, inputNames, userType } from '@/lib/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';
import React from 'react';
import BlogMsg from "@component/dashboard/createblog/BlogMsg";
import Popup from "@component/dashboard/createblog/Popup";
import styles from "@component/dashboard/createblog/createablog.module.css";
import InputForm from "@component/dashboard/createblog/InputForm";
import GenInput from "@dashboard/createblog/GenInput";
import "@pages/globalsTwo.css"

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
    user: userType
}
//NOTE SETUP GET INPUTS(FILEID)=>SETINPUTS() IN DASHBOARD FROM SERVER IN DASHBOARD USING GETSERVERSIDE.
//NOTE InputForm ( CREATES AND UPDATE INPUTS=>SAVE AND UPDATE(PUT))
export default function CreateInputs({ fileId, user }: MainInputsType) {
    const { input_s, setInput_s, setBlogMsg, blogMsg, setInput, input } = useBlogContext();
    const [imgLoaded, setImgLoaded] = React.useState<boolean>(false);
    const [selectType, setSelectType] = React.useState<string>("select");
    const [isSelected, setIsSelected] = React.useState<boolean>(false)


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
    return (
        <div className={styles.mainCreateInputs}>

            <div className={styles.mainSelectInput}>
                {input_s && input_s.map((inputDown, index) => {
                    const check: inputType | undefined = inputNames.find(obj => (obj.type === inputDown.type)) ? inputDown : undefined;
                    if (check) {
                        return (

                            <div key={index} className={styles.genInputContainer}>
                                <GenInput input={check} />
                            </div>

                        )
                    }

                })}
            </div>
            <div className={styles.mainSelectInput}>
                <BlogMsg />
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
