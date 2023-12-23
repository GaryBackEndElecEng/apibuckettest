import React from 'react'
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

export function getEmoj(name: string): React.ReactNode {
    const emoj = emojArr.find(emo => (emo.name === name));
    return emoj?.html
}


type contentStyle = {
    content: string,
    name: string,
    style: string
}
export function parseStyle(name: string) {
    if (name && name.split(";")) {
        let styles = name.split(";")
        let arr: any = []
        styles.forEach((style, index) => {
            let sep = style.split(":")
            let key_ = sep[0];
            let value = sep[1];
            if (key_) {
                arr.push({ [key_]: value })
            }
        })
        return Object.assign({}, ...arr)
    } else {
        return
    }
}

export default function DisplayList({ input }: { input: inputType | null }) {
    const [contentArray, setContentArray] = React.useState<contentStyle[]>([]);
    const isStyleList = input && input.type === "styleList" ? true : false;

    React.useEffect(() => {
        if (input && input.content && isStyleList) {
            const temp = JSON.parse(input.content) as contentStyle[];
            setContentArray(temp);
        }
    }, [input]);

    const ret = contentArray && contentArray.map((content, index) => {
        const emoj = getEmoj(content.name)
        const style = content
        return (
            <React.Fragment key={index}>
                <li className={` ml-[5px]`}
                    style={parseStyle(content.style)}
                >{emoj}{content.content} </li>
            </React.Fragment>
        )
    })
    return (
        <ul className="w-full sm:w-[70%] lg:w-[50%] my-2 mx-auto flex flex-col items-start justify-start pl-[10px]">
            {ret}
        </ul>
    )
}
