"use client";
import React from 'react'
import DisplayList from "./DisplayList"

export type inputType = {
    id?: number,
    name: string,
    order: number | null,
    content: string,
    type: string,
    url: string | null,
    s3Key: string | null,
    fileId: string,
    date?: Date
}
type contentStyle = {
    content: string,
    name: string,
    style: string
}
export const emojArr: { name: string, html: React.ReactNode }[] = [
    { name: "select", html: <span></span> },
    { name: ">>", html: <span>&#187;</span> },
    { name: "hollowDisc", html: <span>&#176;</span> },
    { name: "!", html: <span>&#33;</span> },
    { name: "^2", html: <span>&#178;</span> },
    { name: "^3", html: <span>&#179;</span> },
    { name: "1/4", html: <span>&#188;</span> },
    { name: "1/2", html: <span>&#189;</span> },
    { name: "3/4", html: <span>&#190;</span> },
    { name: "sigma", html: <span>&#664;</span> },
    { name: "omega", html: <span>&#1120;</span> },
    { name: ">", html: <span>&#707;</span> },
    { name: "~", html: <span>&#864;</span> },
    { name: "finger", html: <span>&#128073;</span> },
    { name: "hand", html: <span>&#128075;</span> },
    { name: "thumbsUp", html: <span>&#129305;</span> },
    { name: "peace", html: <span>&#129304;</span> },
    { name: "victory", html: <span>&#9996;</span> },
    { name: "fingerCross", html: <span>&#129310;</span> },
    { name: "pointYou", html: <span>&#129781;</span> },
    { name: "write", html: <span>&#9997;</span> },
    { name: "eye", html: <span>&#128065;</span> },
    { name: "eye", html: <span>&#128065;</span> },
    { name: "double-eye", html: <span>&#128064;</span> },
    { name: "girl", html: <span>&#128103;</span> },
    { name: "baby", html: <span>&#128118;</span> },
    { name: "grandMa", html: <span>&#128117;</span> },
    { name: "lady", html: <span>&#128113;</span> },
    { name: "know?", html: <span>&#129335;</span> },
    { name: "embarrass", html: <span>&#129318;</span> },
    { name: "family", html: <span>&#128106;</span> },
    { name: "person-symb", html: <span>&#128100;</span> },
    { name: "person-speak", html: <span>&#128483;</span> },
    { name: "person-hug", html: <span>&#129730;</span> },
]

export function getEmoj(name: string): React.ReactNode {
    const emoj = emojArr.find(emo => (emo.name === name));
    return emoj?.html
}



export default function FormStyleList({ input }: { input: inputType }) {
    const checkInit = input && input.type === "list" ? input : null;
    const [name, setName] = React.useState<string>(" ");
    const [listContent, setListContent] = React.useState<contentStyle>({} as contentStyle);
    const [array, setArray] = React.useState<contentStyle[]>([]);
    const [checkInput, setCheckInput] = React.useState<inputType | null>(null);


    React.useEffect(() => {
        if (checkInit) {
            setCheckInput(checkInit)
        }
    }, []);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        setListContent({
            ...listContent,
            [e.currentTarget.name]: e.currentTarget.value,
        });

    }


    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const temp: contentStyle[] = [...array, listContent]
        setArray(temp);
        const convContent: string = JSON.stringify(temp)
        setCheckInput({ ...checkInput as inputType, content: convContent as string });
    };

    return (
        <React.Fragment>
            <form onSubmit={(e) => handleOnSubmit(e)} className="w-full flex flex-col items-center justify-center">

                <React.Fragment >
                    <h3 className="my-2 mb-4 text-center">{array.length + 1}</h3>
                    <label htmlFor="style">style</label>
                    <input
                        id="style"
                        name="style"
                        value={listContent.style ? listContent.style : " "}
                        onChange={(e) => handleOnChange(e)}
                        className="border border-slate-800 text-slate-800 bg-white w-full sm:w-3/4 lg:w-1/2 mx-auto rounded-lg"
                    />
                    <label htmlFor="content">listItem</label>
                    <input
                        id="content"
                        name="content"
                        value={listContent.content ? listContent.content : " "}
                        onChange={(e) => handleOnChange(e)}
                        className="border border-slate-800 text-slate-800 bg-white w-full sm:w-3/4 lg:w-1/2 mx-auto rounded-lg"
                    />
                    <label htmlFor="name">list type</label>
                    <select
                        id="name"
                        name="name"
                        value={listContent.name ? listContent.name : " "}
                        onChange={(e) => handleOnChange(e)}
                    >
                        {emojArr && emojArr.map((emoj, index) => (
                            <option key={index} value={emoj.name}>{emoj.name}</option>
                        ))

                        }

                    </select>
                </React.Fragment>



                <button className="px-3 py-1 bg-slate-800 text-white shadow shadow slate-700 rounded-full my-3" type="submit">submit</button>
            </form>

            <h1>Verifying CHECKINPUT</h1>
            <h2>{array.length}</h2>
            <h2>{checkInput?.name}</h2>
            <DisplayList
                input={checkInput}
            />

        </React.Fragment>

    )
}
