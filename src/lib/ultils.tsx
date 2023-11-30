import bcrypt from "bcryptjs";
import { rateType, likeType, likeIcon, likeArr, pageHitType, fileType } from "./Types";
import React from "react";



export async function hashKey(pswd: string) {
    let salt = bcrypt.genSaltSync(8);
    return bcrypt.hashSync(pswd, salt)
}
export async function hashComp(pswd: string, hash: string) {
    var comp = bcrypt.compare(pswd, hash);
    return comp
}
export async function genHash(pswd: string) {
    // "use server"
    let salt = bcrypt.genSaltSync(8);
    return bcrypt.hashSync(pswd, salt)
}
export async function compToHash(pswd: string, hash: string) {
    var comp = bcrypt.compare(pswd, hash);
    return comp
}

export function calcAvg(rates: rateType[]): number {
    const len: number = rates.length ? rates.length : 1;
    const retAvg: number = rates.reduce((a, b) => (a + b.rate), 0) / len;
    const round = Math.round(retAvg);
    return round
}
export function calcLikes(likes: likeType[]): likeIcon[] {
    let arr: likeIcon[] = []
    likeArr.forEach(nam => {
        const item = likes.filter(like => like.name.includes(nam.name))
        if (item) {
            arr.push({ name: nam.name, icon: nam.icon, count: item.length })
        }
    });
    return arr
}
export function calcHits(pageHits: pageHitType[], fileId: string): number {
    let num = 0;
    pageHits.map((page) => {
        if (page.page.includes(fileId) && page.count) {
            num = num + page.count;
        }
    })
    return num
}
export function calcPostHits(pageHits: pageHitType[], postId: string): number {
    let num = 0;
    const Page: string = `posts/${postId}`
    pageHits.map((page) => {
        if (page.page.includes(Page) && page.count) {
            num = 1 + page.count;
        }
    })
    return num
}
export function calcfileHits(pageHits: pageHitType[], file: fileType): number {
    let num = 0;
    const Page: string = `blogs/${file.id}`
    pageHits.map((page) => {
        if (page.page.includes(Page) && page.count) {
            num = num + page.count;
        }
    })
    return num
}
export function ConvertToList({ para }: { para: string }) {
    // searchList

    const numLis: RegExp = /[0-9]+./gm; //This matches 1.),2.),,etc
    const hyphen: RegExp = /-/gm; //matches "-"
    const endHyphen: RegExp = /;/gm; //matches ";"
    const nextLine: RegExp = /\n/gm; //matches "return"
    const searchList = [
        { name: "hyphen", match: hyphen, repl: `<li>  ` },
        { name: "num", match: numLis, repl: `<li>$&  ` },
        { name: "endHyphen", match: endHyphen, repl: "</li>" },
        { name: "endHyphen", match: nextLine, repl: "</li>" },
    ]
    let para2: string = "";
    const getResults = searchList.map((item, index) => {
        if (index === 0) {
            para2 = para
        }
        para2 = para2.replace(item.match, item.repl)
        return `${para2}`
    });
    const results = getResults[getResults.length - 1]
    return (<div dangerouslySetInnerHTML={{ __html: results }} />)


}

export function SeparatePara({ para, class_ }: { para: string, class_: string }) {
    const arr = para.split("\n");
    var retArr: React.JSX.Element[] = []
    if (arr) {
        retArr = arr.map((pg: string, index) => {
            return (
                <p className={`paraCreator ${class_}`} key={index}>{pg}</p>
            )
        });
    }
    return retArr
}

export function useWindowReSize() {
    const [windowSize, setWindowSize] = React.useState(1920);
    const [size, setSize] = React.useState<"xs" | "sm" | "lg" | "md">();
    React.useEffect(() => {
        if (window && window.innerWidth) {
            const handleWindowSizeChange = () => {
                setWindowSize(window.innerWidth)
            };
            window.addEventListener("resize", handleWindowSizeChange);
            return () => {
                window.removeEventListener("resize", handleWindowSizeChange)
            }
        }
    }, []);
    React.useEffect(() => {
        switch (true) {
            case (windowSize > 980):
                setSize("lg");
                break;
            case (windowSize < 980 && windowSize > 480):
                setSize("md");
                break;
            case (windowSize < 480 && windowSize > 420):
                setSize("sm");
                break;
            case (windowSize < 420):
                setSize("xs");
                break;
            default:
                return
        }
    }, [windowSize]);

    return size
}
export function useWindowSize() {
    const [width, setWidth] = React.useState<number>(1920);
    const [size, setSize] = React.useState<"xs" | "sm" | "lg" | "md">();
    React.useEffect(() => {
        setWidth(window.innerWidth);

    }, []);
    React.useEffect(() => {
        switch (true) {
            case (width > 980):
                setSize("lg");
                break;
            case (width < 980 && width > 480):
                setSize("md");
                break;
            case (width < 480 && width > 420):
                setSize("sm");
                break;
            case (width < 420):
                setSize("xs");
                break;
            default:
                return
        }
    }, [width]);
    return size

}

export function NameSep(nam: string) {
    let arr = nam.split("");
    let newName: string = nam;
    arr.forEach((let_, index) => {
        if (index > 0 && (let_.toUpperCase() === let_)) {
            newName = `${arr.slice(0, index).join("")} ${arr.slice(index, arr.length - 1).join("")} `
        }
    });
    return newName
}

export function useChange(path: string | null) {
    const [hasChanged, setHasChanged] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (window && path) {
            setHasChanged(true);
        } else { setHasChanged(false) }
    }, [path]);
    return hasChanged
}