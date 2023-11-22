"use client";
import { inputType } from '@/lib/Types';
import React from 'react';
import "@pages/globalsTwo.css"
import Image from 'next/image';
import { ConvertToList, SeparatePara } from "@lib/ultils";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { useBlogContext } from '@/components/context/BlogContextProvider';
import styles from "@dashboard/createblog/createablog.module.css";
//UPLOADING AND GETTING IMAGES IS OUTSIDE THIS JSX ELEMENT
//USED FOR DISPLAY IN CREATION AND file generation.



export default function GenInput({ input }: { input: inputType }) {
    const [image, setImage] = React.useState<string | null>(null);
    const { setBlogMsg, setInput } = useBlogContext();
    const type: string = input.type.toLowerCase();
    const s3Key: string | null = input.s3Key ? input.s3Key : null;
    const check: boolean = (type === "image" && s3Key && !input.url) ? true : false;

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
                    {input.url &&
                        <div className={styles.genInputImg}>
                            <h4>{input.name}</h4>
                            <div className="flexcol">
                                <Image src={input.url} width={900} height={600} alt={input.name}
                                    className="inputImage"
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
                <div className="inputHeading">
                    {input.name && <h2 className="inputBold">
                        {input.name}
                    </h2>}
                    <h3>
                        {input.content}
                    </h3>
                </div>
            )
        case "subHeading":
            return (
                <div className="inputSubHeading">
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
                <div className="inputSection">
                    {input.name && <h4>
                        {input.name}
                    </h4>}
                    <section>
                        <SeparatePara para={input.content} class_={"pSection"} />
                    </section>
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
        case "article":
            return (
                <div className="inputArticle">
                    {input.name && <h3>
                        {input.name}
                    </h3>}
                    <section>
                        <SeparatePara para={input.content} class_={"pSection"} />
                    </section>
                </div>
            )
        case "conclusion":
            return (
                <section className="inputConclusion">
                    {input.name && <h4>
                        {input.name}
                    </h4>}
                    <SeparatePara para={input.content} class_={"pSection"} />
                </section>

            )
        default:
            return <></>
    }
}
