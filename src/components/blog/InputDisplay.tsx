"use client";
import { contactType, inputType, contentStyle } from '@/lib/Types';
import React from 'react';
// import "@pages/globalsTwo.css"
import Image from 'next/image';
import { ConvertToFormula, ConvertToList, SeparatePara, parseLink } from "@lib/ultils";
import styles from "@component/blog/blog.module.css";
import { useGeneralContext } from '../context/GeneralContextProvider';
import { TextField } from '@mui/material';
import { useBlogContext } from '../context/BlogContextProvider';
import { IoMdHappy } from "react-icons/io";
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaArrowRightLong } from "react-icons/fa6";
import { getEmoj, emojArr, parseStyle } from "@component/compForms/formList/DisplayList"

type contactFetchType = {
    contact: contactType,
    message: string
}
//UPLOADING AND GETTING IMAGES IS OUTSIDE THIS JSX ELEMENT
//USED FOR DISPLAY IN CREATION AND file generation.
export default function InputDisplay({ input }: { input: inputType }) {
    return (
        <GenInput input={input} />
    )
}


function GenInput({ input }: { input: inputType }) {
    const { setBlogMsg } = useBlogContext();
    const checkInput = (input && input.type) ? input : null;
    const type: string | null = checkInput && checkInput.type.toLowerCase();
    const { user } = useGeneralContext();
    const [reply, setReply] = React.useState<contactType>({} as contactType);
    const [didReply, setDidReply] = React.useState<boolean>(false);
    const [wantToReply, setWantToReply] = React.useState<boolean>(false);
    const [contentArray, setContentArray] = React.useState<contentStyle[]>([]);
    const isStyleList = input && input.type === "styleList" ? true : false;

    React.useEffect(() => {
        if (input && input.content && isStyleList) {
            const temp = JSON.parse(input.content) as contentStyle[];
            setContentArray(temp);

        }
    }, [input, setContentArray, isStyleList]);



    React.useEffect(() => {
        if (user && type && type === "reply" && reply && !reply.userId) {
            setReply(
                { ...reply, userId: user.id as string }
            )
        }
    }, [setReply, user, reply, type]);

    const handleLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, link: string) => {
        e.preventDefault();
        if (window) {
            window.open(link, "blank")
        }
    }

    switch (type) {
        case "image":
            return (
                <>
                    {input.url &&
                        <div className={styles.inputImage}>
                            <Image src={input.url} width={900} height={600} alt={input.name}
                                style={{ width: "auto" }}
                            />
                            <small>
                                {input.name} : {input.content}
                            </small>
                        </div>
                    }
                </>
            )
        case "heading":
            return (
                <div className="heading">
                    {input.name && <h2 className="inputBold">
                        {input.name}
                    </h2>}
                    <h3>
                        {input.content}
                    </h3>
                </div>
            )
        case "subheading":
            return (
                <div className="subHeading">
                    {input.name && <h3>
                        {input.name}
                    </h3>}
                    <h4>
                        {input.content}
                    </h4>
                </div>
            )
        case "section":
            return (
                <section className="section">
                    {input.name && <h4>
                        {input.name} :
                    </h4>}
                    <div>
                        <SeparatePara para={input.content} class_={"pSection"} />
                    </div>
                </section>
            )
        case "link":
            return (
                <div className="link" style={{ position: "relative", width: "100%" }}>
                    {input.name && <h3>
                        {input.name} :
                    </h3>}
                    <div onClick={(e) => handleLink(e, input.content)} >
                        <FaArrowRightLong style={{ color: "orange" }} />{parseLink(input.content)}
                    </div>
                </div>
            )
        case "list":
            return (
                <>
                    <section className="list">
                        <ul>{input.name && input.name}
                            <ConvertToList para={input.content} />
                        </ul>
                    </section>
                </>
            )
        case "stylelist":

            const ret = contentArray && contentArray.map((content, index) => {
                const emoj = getEmoj(content.name)
                const style = content
                return (
                    <ul className={styles.formStyleDisplayMain} key={index}>
                        <li className={` ml-[5px]`}
                            style={parseStyle(content.style)}
                        >{emoj}{content.content} </li>
                    </ul>
                )
            })
            return (
                <ul className="w-full sm:w-[70%] lg:w-[50%] my-2 mx-auto flex flex-col items-start justify-start pl-[10px]">
                    {ret}
                </ul>


            )

        case "article":
            return (
                <article className="article">
                    {input.name && <h2>
                        {input.name}
                    </h2>}
                    <section>
                        <SeparatePara para={input.content} class_={"pSection"} />
                    </section>
                </article>
            )
        case "code":
            return (

                <section className="code" style={{ position: "relative", width: "100%" }}>
                    <h3 className="text-center text-xl underline underline-offest-8 my-2">{input.name && input.name}</h3>
                    <div>
                        <ConvertToFormula para={input.content} />
                    </div>
                </section>

            )
        case "conclusion":
            return (
                <section className="conclusion">
                    {input.name && <h4>
                        {input.name}
                    </h4>}
                    <SeparatePara para={input.content} class_={"pSection"} />
                </section>

            );
        case "reply":

            const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (checkInput && checkInput.type === "reply" && reply && reply.userId && reply.email && reply.content) {
                    const res = await fetch("/api/email", {
                        method: "POST",
                        body: JSON.stringify(reply)
                    });
                    const body: contactFetchType = await res.json();
                    if (res.ok) {
                        setBlogMsg({ loaded: true, msg: `${body.message} ` });
                        toast.success(`we will reply ASAP to ${body.contact.subject}`)
                        setReply(body.contact);
                        setDidReply(true);
                    } else if (res.status >= 400 && res.status < 500) {
                        toast.error(body.message)
                    }
                } else {
                    toast.error(`Was not sent, missing reply`)
                    console.log("reply is not complete", reply)
                }

            }
            const handleReplyOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                e.preventDefault();
                setReply({
                    ...reply,
                    [e.target.name]: e.target.value
                });
            }
            return (
                <React.Fragment>

                    {!wantToReply && input.name &&
                        <div className={styles.preReply}>
                            <h4>
                                {input.name}
                            </h4>
                            <p>{input.content}</p>
                        </div>
                    }
                    {!didReply && checkInput && checkInput.type === "reply" &&
                        <React.Fragment>
                            {!wantToReply ?
                                <button className="buttonsm bg-slate-600 text-white shadow shadow-blue-800" onClick={() => setWantToReply(true)}> send a reply</button>
                                :
                                <button className="buttonsm bg-slate-600 text-white shadow shadow-black" onClick={() => setWantToReply(false)}> close</button>
                            }
                            <section className={wantToReply ? styles.showReply : styles.hideReply} style={{ position: "relative", width: "100%" }}>
                                {input.name && <h4>
                                    {input.name}
                                </h4>}
                                <p>{input.content}</p>

                                <form action="" onSubmit={(e) => handleReplySubmit(e)}
                                    className="formReplySubmit"
                                >
                                    <TextField
                                        value={reply?.subject}
                                        label={"subject"}
                                        name={"subject"}
                                        placeholder='your subject'
                                        onChange={(e) => handleReplyOnChange(e)}
                                    />
                                    <TextField
                                        value={reply?.email}
                                        autoComplete={"email"}
                                        name={"email"}
                                        label={"email"}
                                        required
                                        id={reply && reply.email ? reply.email : "email id"}
                                        onChange={(e) => handleReplyOnChange(e)}
                                        placeholder={"email please"}
                                        size={"medium"}
                                    />
                                    <TextField
                                        fullWidth={true}
                                        value={reply?.content}
                                        multiline={true}
                                        minRows={4}
                                        name={"content"}
                                        label={"your thoughts"}
                                        required
                                        onChange={(e) => handleReplyOnChange(e)}
                                        placeholder={"Your request"}
                                        size={"medium"}
                                        style={{ width: "100%" }}
                                    />
                                    {reply.email && reply.content && <button className="buttonsm" type="submit">
                                        send me a reply
                                    </button>}
                                </form>

                            </section>
                        </React.Fragment>

                    }
                    {didReply &&
                        <section className="replyForm">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-center mx-auto">
                                    Thank you for replying to me. I will answer your request by email.
                                </p>
                                <p className="text-center mx-auto">
                                    Again, thank you for your support.
                                </p>
                                <IoMdHappy styles={{ color: "yellow", borderRadius: "50%", margin: "1rem" }}
                                    className="bg-slate-600"
                                />
                            </div>
                        </section>
                    }

                </React.Fragment>

            );

        default:
            return <></>
    }
}
