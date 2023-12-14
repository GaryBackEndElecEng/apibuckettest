import { inputType, inputNames, userType, msgType, contactType } from '@/lib/Types'
import { getErrorMessage } from '@/lib/errorBoundaries';
import { ConvertToFormula } from '@/lib/ultils';
import { TextField } from '@mui/material';
import React from 'react';
import styles from "./form.module.css";
import { v4 as uuidv4 } from "uuid";
import { searchList, ConvertRes } from '../context/arrayList';
const url = "https://garyposttestupload.s3.amazonaws.com"

type GenFormType = {
    setInput: React.Dispatch<React.SetStateAction<inputType | undefined>>,
    input: inputType | undefined
};
type ImgFormType = {
    setInput: React.Dispatch<React.SetStateAction<inputType | undefined>>,
    input: inputType | undefined,
    user: userType | null,
    setImgLoaded: React.Dispatch<React.SetStateAction<boolean>>,
    setBlogMsg: React.Dispatch<React.SetStateAction<msgType>>
};
export function SecPlusForm({ input, setInput }: GenFormType) {
    //CORRECT THIOS FOR TOMMORROW!!-REMOVE CHECK BECAUSE +> ITS THE REASON
    const checkArr = [
        { name: "section" },
        { name: "conclusion" },//not seeing
        { name: "summary" },
        { name: "article" } //not seeing!!
    ]
    if (input && input.type) {
        const check: inputType | null = checkArr.find(obj => (obj.name === input.type)) ? input : null;
        // console.log("SECTION-FormInputs", check && check)
        if (check) {
            return (
                <div className="flex flex-col gap-2 items-center justify-evenly w-full">
                    <TextField
                        fullWidth={true}
                        helperText={`${check.type}-header`}
                        id={`${check.type}-${check.id ? check.id : "name"}`}
                        label={`${check.type}-header`}
                        multiline={false}
                        name={`${check.type}-name`}
                        placeholder={`${check.type}-sub header`}
                        required
                        size={"medium"}
                        type="text"
                        variant="filled"
                        value={check.name ? check.name : ""}
                        onChange={(e) => setInput({ ...check, name: e.target.value as string })}
                        style={{ fontFamily: "bold" }}
                    />
                    <TextField
                        fullWidth={true}
                        helperText={`${check.type}-body`}
                        id={`${check.type}-body`}
                        label={`${check.type}-body`}
                        multiline={true}
                        minRows={4}
                        name={`${check.type}-content`}
                        placeholder={`body content`}
                        required
                        size={"medium"}
                        type="text"
                        variant="filled"
                        value={check && check.content ? check.content : ""}
                        onChange={(e) => setInput({ ...check, content: e.target.value as string })}
                        className="w-full"
                        style={{ fontFamily: "bold", width: "100%" }}
                    />
                </div>
            )
        } else { return (<></>) }
    } else {
        return (<></>)
    }
}
export function HeaderPlusForm({ input, setInput }: GenFormType) {
    //"heading" || "subHeading" || "list"
    const checkArr = [
        { name: "heading" },
        { name: "subHeading" },

    ]
    if (input && input.type) {
        const check: inputType | null = checkArr.find(obj => (obj.name === input.type)) ? input : null;
        if (!check) return (<></>);
        return (
            <div>
                <TextField
                    fullWidth={true}
                    helperText={`${check.type}-name`}
                    id={`${check.type}-${check.id ? check.id : "name"}`}
                    label={`${check.type}-name`}
                    multiline={false}
                    name={`${check.type}-header`}
                    placeholder={`name header`}
                    required
                    size={"medium"}
                    type="text"
                    variant="filled"
                    value={check.name ? check.name : ""}
                    onChange={(e) => setInput({ ...check, name: e.target.value as string })}
                    style={{ fontFamily: "bold" }}
                />
                <TextField
                    fullWidth={true}
                    helperText={`${check.type}-body`}
                    id={`${check.type}-${check.id ? check.id : "body"}`}
                    label={`${check.type}-body`}
                    multiline={false}
                    name={`${check.type}-content`}
                    placeholder={`body content`}
                    required
                    size={"medium"}
                    type="text"
                    variant="filled"
                    value={check && check.content ? check.content : ""}
                    onChange={(e) => setInput({ ...check, content: e.target.value as string })}
                    style={{ fontFamily: "bold", width: "max-content" }}
                />
            </div>
        )
    } else {
        return (<></>)
    }
}
export function ImgForm({ input, setInput, user, setImgLoaded, setBlogMsg }: ImgFormType) {
    const checkArr = [
        { name: "image" },
        { name: "image" },
        { name: "image" },
    ]
    if (input && input.type) {
        const check = input.type === "image" ? input : null;
        if (!check) return (<></>);

        const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            if (check && user) {
                if (e.target?.files) {
                    const file: File = e.target.files[0]
                    const Key = `${user.name?.trim()}/${input.fileId}/${uuidv4().split("-")[0]}-${file.name}`;
                    const formData = new FormData();
                    formData.set("file", file);
                    formData.set("Key", Key)
                    try {
                        const res = await fetch("/api/media", {
                            method: "POST",
                            body: formData
                        });
                        if (res.ok) {
                            setImgLoaded(true);
                            setInput({ ...check, s3Key: Key, url: `${url}/${Key}` })
                            setBlogMsg({ loaded: true, msg: "img saved" });
                        }
                    } catch (error) {
                        const message = getErrorMessage(error);
                        console.error(message)
                        setBlogMsg({ loaded: false, msg: `${message}@media` })
                    }
                }
            }
        }
        return (
            <div className="flex flex-col justify-evenly items-center gap-2">
                <input
                    type="file"
                    name="file"
                    accept="image/jpg image/jpeg image/png"
                    onChange={
                        (e) => handleOnChange(e)
                    }
                />
                <ImgAddForm input={input} setInput={setInput} />
            </div>
        )
    } else {
        return (<></>)
    }
}

export function ImgAddForm({ input, setInput }: GenFormType) {
    //"heading" || "subHeading" || "list"

    if (input && input.type) {
        const check: inputType | null = (input.type === "image") ? input : null;
        if (!check) return (<></>);
        return (
            <div>
                <TextField
                    fullWidth={true}
                    helperText={`${check.type}-name`}
                    id={`${check.type}-${check.id ? check.id : "name"}`}
                    label={`${check.type}-name`}
                    multiline={false}
                    name={`${check.type}-header`}
                    placeholder={`name header`}
                    required
                    size={"medium"}
                    type="text"
                    variant="filled"
                    value={check.name ? check.name : ""}
                    onChange={(e) => setInput({ ...check, name: e.target.value as string })}
                    style={{ fontFamily: "bold" }}
                />
                <TextField
                    fullWidth={true}
                    helperText={`${check.type}-body`}
                    id={`${check.type}-${check.id ? check.id : "body"}`}
                    label={`${check.type}-body`}
                    multiline={false}
                    name={`${check.type}-content`}
                    placeholder={`body content`}
                    required
                    size={"medium"}
                    type="text"
                    variant="filled"
                    value={check && check.content ? check.content : ""}
                    onChange={(e) => setInput({ ...check, content: e.target.value as string })}
                    style={{ fontFamily: "bold" }}
                />
            </div>
        )
    } else {
        return (<></>)
    }
}

export function LinkForm({ input, setInput }: GenFormType) {

    if (input && input.type) {
        const check: inputType | null = input.type === "link" ? input : null;
        if (!check) return (<></>);
        return (
            <div>
                <TextField
                    fullWidth={true}
                    helperText={`${check.type}-link name`}
                    id={`${check.type}-${check.id ? check.id : "link name"}`}
                    label={`${check.type}-link name`}
                    multiline={false}
                    name={`${check.type}-link name`}
                    placeholder={`add link name`}
                    required
                    size={"medium"}
                    type="text"
                    value={check.name ? check.name : ""}
                    onChange={(e) => setInput({ ...check, name: e.target.value as string })}
                    style={{ fontFamily: "bold" }}
                />
                <TextField
                    fullWidth={true}
                    helperText={`${check.type}-link`}
                    id={`${check.type}-${check.id ? check.id : "link"}`}
                    label={`${check.type}-link`}
                    multiline={false}
                    name={`${check.type}-link`}
                    placeholder={`body link`}
                    required
                    size={"medium"}
                    type="text"
                    variant="filled"
                    value={check && check.content ? check.content : ""}
                    onChange={(e) => setInput({ ...check, content: e.target.value as string })}
                    style={{ fontFamily: "bold", width: "max-content" }}
                />
            </div>
        )
    } else {
        return (<></>)
    }
}
export function ReplyForm({ input, setInput }: GenFormType) {
    const check = input && input.type === "reply" ? input : null;

    return (
        <React.Fragment>
            {check &&
                <div className="flex flex-col items-stretch justify-center gap-2">
                    <TextField
                        fullWidth={false}
                        helperText={`${check.type}-reply name`}
                        id={`${check.type}-${check.id ? check.id : "reply name"}`}
                        label={`${check.type}-reply name`}
                        multiline={false}
                        name={`${check.type}-reply name`}
                        placeholder={`add reply name`}
                        required
                        size={"medium"}
                        type="text"
                        value={check.name ? check.name : ""}
                        onChange={(e) => setInput({ ...check, name: e.target.value as string })}
                        style={{ fontFamily: "bold" }}
                    />
                    <TextField
                        fullWidth={true}
                        helperText={`${check.type}-reply`}
                        id={`${check.type}-${check.id ? check.id : "reply"}`}
                        label={`${check.type}-reply`}
                        multiline={false}
                        name={`${check.type}-reply`}
                        placeholder={`body reply`}
                        required
                        size={"medium"}
                        type="text"
                        variant="outlined"
                        value={check && check.content ? check.content : ""}
                        onChange={(e) => setInput({ ...check, content: e.target.value as string })}
                        style={{ fontFamily: "bold", width: "max-content" }}
                    />
                </div>
            }
        </React.Fragment>
    )
}
export function ListForm({ input, setInput }: GenFormType) {
    //"heading" || "subHeading" || "list"

    if (input && input.type) {
        const check: inputType | null = input.type == "list" ? input : null;
        if (!check) return (<></>);
        return (
            <div className="mx-auto flex flex-col items-center justify-center">
                <TextField
                    fullWidth={true}
                    helperText={`${check.type}-name list`}
                    id={`${check.type}-${check.id ? check.id : "name list"}`}
                    label={`${check.type}-name list`}
                    multiline={false}
                    name={`${check.type}-list`}
                    placeholder={`name list`}
                    required
                    size={"medium"}
                    type="text"
                    variant="outlined"
                    value={check.name ? check.name : ""}
                    onChange={(e) => setInput({ ...check, name: e.target.value as string })}
                    style={{ fontFamily: "bold" }}
                />
                <TextField
                    fullWidth={true}
                    helperText={`${check.type}-list body`}
                    id={`${check.type}-${check.id ? check.id : "list body"}`}
                    label={`${check.type}-list body`}
                    multiline={true}
                    minRows={4}
                    name={`${check.type}-list body`}
                    placeholder={`body your list`}
                    required
                    size={"medium"}
                    type="text"
                    variant="outlined"
                    value={check && check.content ? check.content : ""}
                    onChange={(e) => setInput({ ...check, content: e.target.value as string })}
                    style={{ fontFamily: "bold", width: "100%" }}
                />
            </div>
        )
    } else {
        return (<></>)
    }
}

export function CodeForm({ input, setInput }: GenFormType) {
    //"heading" || "subHeading" || "list"

    if (input && input.type) {
        const check: inputType | null = input.type == "code" ? input : null;
        if (!check) return (<></>);
        return (
            <div className={styles.codeFormMain}>
                <div className={styles.formGrid}>
                    <div className={styles.gridOne}>
                        <TextField
                            fullWidth={true}
                            helperText={`${check.type}-name list`}
                            id={`${check.type}-${check.id ? check.id : "name list"}`}
                            label={`${check.type}-name list`}
                            multiline={false}
                            name={`${check.type}-list`}
                            placeholder={`name list`}
                            required
                            size={"medium"}
                            type="text"
                            variant="outlined"
                            value={check.name ? check.name : ""}
                            onChange={(e) => setInput({ ...check, name: e.target.value as string })}
                            style={{ fontFamily: "bold" }}
                        />
                        <TextField
                            fullWidth={true}
                            helperText={`${check.type}-list body`}
                            id={`${check.type}-${check.id ? check.id : "list body"}`}
                            label={`${check.type}-list body`}
                            multiline={true}
                            minRows={4}
                            name={`${check.type}-list body`}
                            placeholder={`body your list`}
                            required
                            size={"medium"}
                            type="text"
                            variant="outlined"
                            value={check && check.content ? check.content : ""}
                            onChange={(e) => setInput({ ...check, content: e.target.value as string })}
                            style={{ fontFamily: "bold", width: "100%" }}
                        />
                    </div>
                    <div className={styles.gridTwo}>
                        <table>
                            <tr>
                                <th>name</th>
                                <th>symbol</th>
                            </tr>
                            {searchList && searchList.map((obj, index) => (
                                <tr key={index}>
                                    <td>{obj.name}</td>
                                    <td><ConvertRes sym={obj.sym} /></td>
                                </tr>

                            ))
                            }

                        </table>
                    </div>
                </div>

                <section className="code" style={{ position: "relative", width: "100%" }}>
                    <h3 className="text-center text-xl underline underline-offest-8 my-2">{input.name && input.name}</h3>
                    <div>
                        <ConvertToFormula para={input.content} />
                    </div>
                </section>
            </div>
        )
    } else {
        return (<></>)
    }
}
