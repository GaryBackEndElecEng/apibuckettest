"use client";
import { inputType } from '@/lib/Types';
import React from 'react';
// import "@pages/globalsTwo.css"
import Image from 'next/image';
import { ConvertToList, SeparatePara } from "@lib/ultils";
import styles from "@component/blog/blog.module.css";

//UPLOADING AND GETTING IMAGES IS OUTSIDE THIS JSX ELEMENT
//USED FOR DISPLAY IN CREATION AND file generation.
export default function InputDisplay({ input }: { input: inputType }) {
    return (
        <GenInput input={input} />
    )
}


function GenInput({ input }: { input: inputType }) {
    const type: string = input.type.toLowerCase();
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
                <div className="">
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
                <div className="">
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
