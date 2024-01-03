"use client";
import { contentStyle, inputType, targetType } from '@/lib/Types';
import React from 'react';
import Image from 'next/image';
import { ConvertToFormula, ConvertToList, SeparatePara, parseStyle, getEmoj, emojArr } from "@lib/ultils";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { useBlogContext } from '@/components/context/BlogContextProvider';
import styles from "@dashboard/createblog/createablog.module.css";
import { FaTrash } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";
import { IconButton, TextField } from "@mui/material";
import GenericMsg from '@/components/comp/GenericMsg';
import Link from 'next/link';
import { useGeneralContext } from '@/components/context/GeneralContextProvider';

type inputFetchType = {
    input: inputType,
    message: string
}

type genInputType = {
    setInput: React.Dispatch<React.SetStateAction<inputType | undefined>>,
    input: inputType,
    setIsSelected: React.Dispatch<React.SetStateAction<boolean>>,
    setIsDeleted: React.Dispatch<React.SetStateAction<targetType>>,
}
export default function GenInput({ input, setInput, setIsSelected, setIsDeleted }: genInputType) {
    const { user } = useGeneralContext();
    const checkInput = (input && input.type) ? input : null;
    const [image, setImage] = React.useState<string | null>(null);
    const { setBlogMsg, blogMsg, input_s, setInput_s } = useBlogContext();
    const type: string | null = (checkInput && checkInput.name !== "fill") ? checkInput.type : null;
    const s3Key: string | null = input.s3Key ? input.s3Key : null;
    const check: boolean = (type && type === "image" && s3Key && !input.url) ? true : false;
    const [contentArray, setContentArray] = React.useState<contentStyle[]>([]);
    const isStyleList = input && input.type === "styleList" ? true : false;

    React.useEffect(() => {

        if (input && input.content && isStyleList) {
            const check: boolean = input.content.includes("[") ? true : false;
            if (check) {
                const temp = JSON.parse(input.content) as contentStyle[];
                setContentArray(temp);
            }
        }
    }, [input]);

    React.useEffect(() => {
        if (check) {

            const getImage = async () => {
                try {
                    const res = await fetch(`/api/getmedia?Key=${s3Key}`);
                    if (res.ok) {
                        const body: { url: string, Key: string } = await res.json();
                        setImage(body.url);
                        setInput({ ...input, url: body.url })
                        setBlogMsg({ loaded: true, msg: "uploading" });
                        return
                    }
                } catch (error) {
                    const message = getErrorMessage(error);
                    console.error(`${message}@GenInput@media`);
                    setBlogMsg({ loaded: false, msg: message });
                    return
                }
            }
            getImage();
        }
    }, []);

    switch (type) {
        case "image":
            return (
                <>
                    {input.url && input.s3Key &&
                        <div className={styles.genInputImg}
                            style={{ position: "relative", width: "100%" }}
                        >
                            <small>order: {input.order}</small>
                            <h4>{input.name}</h4>
                            <div className="flexcol">
                                <Image src={input.url} width={900} height={600} alt={input.name}
                                    className="inputImage"
                                    placeholder="blur"
                                    blurDataURL={input.url}
                                    style={{ width: "auto" }}
                                />
                                <small>{input.content}</small>
                            </div>
                        </div>
                    }
                </>
            )
        case "heading":
            return (
                <div className="inputHeading" style={{ position: "relative", width: "100%" }}>
                    {input.name &&
                        <React.Fragment>
                            <small>order: {input.order}</small>
                            <h2 className="inputBold">
                                {input.name}
                            </h2>
                        </React.Fragment>
                    }
                    <h3>
                        {input.content}
                    </h3>
                </div>
            )
        case "subHeading":
            return (
                <div className="inputSubHeading" style={{ position: "relative", width: "100%" }}>
                    {input.name &&
                        <React.Fragment>
                            <small>order: {input.order}</small>
                            <h3>
                                {input.name}
                            </h3>
                        </React.Fragment>
                    }
                    <h4>
                        {input.content}
                    </h4>
                </div>
            )
        case "link":
            return (
                <div className="link" style={{ position: "relative", width: "100%" }}>
                    {input.name &&
                        <React.Fragment>
                            <small>order: {input.order}</small>
                            <h3>
                                {input.name}
                            </h3>
                        </React.Fragment>
                    }
                    <Link href={input.content}>
                        {input.content}
                    </Link>
                </div>
            )
        case "section":
            return (
                <React.Fragment>
                    <small>order: {input.order}</small>
                    <section className="section" style={{ position: "relative", width: "100%" }}>
                        {input.name &&
                            <React.Fragment>

                                <h4>
                                    {input.name}
                                </h4>
                            </React.Fragment>
                        }
                        <div>
                            <SeparatePara para={input.content} class_={"pSection"} />
                        </div>
                    </section>
                </React.Fragment>
            )
        case "list":
            return (
                <React.Fragment>
                    <small>order: {input.order}</small>
                    <section className="list">
                        <ul>{input.name && input.name}
                            <ConvertToList para={input.content} />
                        </ul>
                    </section>
                </React.Fragment>

            )
        case "code":
            return (
                <React.Fragment>
                    <small>order: {input.order}</small>
                    <section className="code" style={{ position: "relative", width: "100%" }}>
                        <h3 className="text-center text-xl underline underline-offest-8 my-2">{input.name && input.name}</h3>
                        <div>
                            <ConvertToFormula para={input.content} />
                        </div>
                    </section>
                </React.Fragment>

            )
        case "article":
            return (
                <React.Fragment>
                    <small>order: {input.order}</small>
                    <article className="article" style={{ position: "relative", width: "100%" }}>
                        {input.name && <h3>
                            {input.name}
                        </h3>}
                        <section>
                            <SeparatePara para={input.content} class_={"pSection"} />
                        </section>
                    </article>
                </React.Fragment>
            )
        case "reply":

            return (
                <React.Fragment>
                    <small>order: {input.order}</small>
                    {checkInput && checkInput.type === "reply" &&

                        <section className="replyForm" style={{ position: "relative", width: "100%" }}>
                            {input.name && <h4>
                                {input.name}
                            </h4>}
                            <p>{input.content}</p>

                        </section>

                    }
                </React.Fragment>

            )
        case "styleList":
            const ret = contentArray && contentArray.map((content, index) => {
                const emoj = getEmoj(content.name)
                const style = content
                return (
                    <React.Fragment key={index}>

                        <li
                            style={parseStyle(content.style)}
                        >{emoj}{content.content} </li>
                    </React.Fragment>
                )
            })
            return (
                <React.Fragment>
                    <small>order: {input.order}</small>
                    <ul className={styles.formStyleDisplayMain}>
                        {ret}
                    </ul>
                </React.Fragment>
            )
        case "conclusion":
            return (
                <React.Fragment>
                    <small>order: {input.order}</small>
                    <section className="conclusion" style={{ position: "relative", width: "100%" }}>
                        {input.name &&
                            <React.Fragment>

                                <h4>
                                    {input.name}
                                </h4>
                            </React.Fragment>
                        }
                        <SeparatePara para={input.content} class_={""} />
                    </section>
                </React.Fragment>

            )
        default:
            return <></>
    }
}
