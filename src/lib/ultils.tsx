import bcrypt from "bcryptjs";
import { rateType, likeType, likeIcon, likeArr, pageHitType, fileType, nameRateType, postType } from "./Types";
import React from "react";
import { useGeneralContext } from "@/components/context/GeneralContextProvider";



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

    const [size, setSize] = React.useState<"xs" | "sm" | "lg" | "md">("lg");

    React.useEffect(() => {
        if (window) {
            const width = window.innerWidth ? window.innerWidth : 1920;
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
        }
    }, []);
    return size

}

export function NameSep(nam: string) {
    let arr = nam.split("");
    let newName: string = nam;
    arr.forEach((let_, index) => {
        if (index > 0 && (let_.toUpperCase() === let_)) {
            newName = `${arr.slice(0, index).join("")} ${arr.slice(index, arr.length - 1).join("")} `
        } else if (index > 0 && let_ === "-") {
            newName = `${arr.slice(0, index).join("")} ${arr.slice(index, arr.length - 1).join("")} `
        }
    });
    return newName
}
export function unifyName(nam: string): string {
    let name = nam.split(" ");
    let wrd: string = "";
    if (name.length > 0) {
        name.forEach((word, index) => {
            if (wrd === "") {
                wrd = word;
            } else {
                wrd = wrd + "-" + word
            }
        });
    } else {
        wrd = nam
    }
    return wrd
}

export function useChange(path: string | null) {
    const [hasChanged, setHasChanged] = React.useState<boolean>(false);
    React.useEffect(() => {
        const initFunc = () => {
            window.history.pushState(path, "");
            window.dispatchEvent(new Event("popstate"))
        }
        if (window && path) {
            let lastUrl = window.history.state.tree[1]
            window.addEventListener("popstate", initFunc);
            setHasChanged(true)


        } else { setHasChanged(false) }
        return () => window.removeEventListener("popstate", initFunc)
    }, [path]);
    return hasChanged
}
export function filterSort(arr: nameRateType[]) {
    let cleanArr: nameRateType[] = [];
    for (const [key, value] of Object.entries(arr)) {
        const obj = cleanArr.find(obj => (obj.name === value.name));
        if (!obj) {
            cleanArr.push(value)
        }
    }
    return cleanArr
}

export function ArrRateFileResult(files: fileType[]) {
    let arr: nameRateType[] = []
    files.map((file, index) => {
        const len = file.rates && file.rates.length > 0 ? file.rates.length : 1;
        const calcAv = file.rates.reduce((a, b) => (a + b.rate), 0);
        const rateAv = Math.round(calcAv / len)
        arr.push({ name: file.name, avRate: rateAv, count: len });
        return
    });
    return filterSort(arr)
}
export function ArrRatePostResult(posts: postType[]) {
    let arr: nameRateType[] = []
    posts.map((post, index) => {
        const len = post.rates && post.rates.length > 0 ? post.rates.length : 1;
        const calcAv = post.rates.reduce((a, b) => (a + b.rate), 0);
        const rateAv = Math.round(calcAv / len)
        arr.push({ name: post.name, avRate: rateAv, count: len });
        return
    });
    return filterSort(arr)
}

export function postHits(pages: pageHitType[], posts: postType[]): pageHitType[] {
    const retResults = posts.map((post, index) => {
        const getpageHits = pages.filter(page => (page.page.includes(`/posts/${post.id}`)));
        const retCount = getpageHits.reduce((a, b) => (a + b.count), 0);
        const newHit = { ...getpageHits[0], name: post.name, count: retCount }
        return newHit
    });
    return retResults
}
export function blogHits(pages: pageHitType[], files: fileType[]): pageHitType[] {
    const retResults = files.map((file, index) => {
        const getpageHits = pages.filter(page => (page.page.includes(`/blogs/${file.id}`)));
        const retCount = getpageHits.reduce((a, b) => (a + b.count), 0);
        const newHit = { ...getpageHits[0], name: file.name, count: retCount }
        return newHit
    });
    return retResults
}

export function useHits() {
    type retType = {
        page: string,
        count: number
    }
    const { pageHits } = useGeneralContext();
    const [total, setTotal] = React.useState<number>(0);
    const [retArr, setRetArr] = React.useState<retType[]>([])
    React.useEffect(() => {
        if (pageHits) {
            const getTotal = pageHits.reduce((a, b) => (a + b.count), 0);
            setTotal(getTotal);
            const getArr = pageHits.map(page => ({ page: page.page, count: page.count }));
            setRetArr(getArr);
        }
    }, [pageHits]);
    return { total, pageArr: retArr }
}
export function useLikes(likes: likeType[]) {
    const [iconLikes, setIconLikes] = React.useState<(likeIcon | undefined)[]>([]);
    React.useEffect(() => {
        const getLikes = likeArr.map(nIcon => {
            const likearr = likes.filter(n => (n.name === nIcon.name));
            if (likearr && likearr.length > 0) {
                const sum = likearr.reduce((a, b) => (a + b.count), 0)
                return { name: nIcon.name, icon: nIcon.icon, count: sum }
            }
        });
        setIconLikes(getLikes)
    }, [likes]);
    return iconLikes
}
export function usePostLikes(posts: postType[]): likeIcon[] {
    const [iconLikes, setIconLikes] = React.useState<likeIcon[]>([]);
    React.useEffect(() => {
        let concatArr: likeIcon[] = [];
        if (posts) {
            posts.map(post => {
                likeArr.map(iconName => {
                    const likeNames = post.likes.filter(like => (like.name === iconName.name));
                    concatArr.push({ name: iconName.name, count: likeNames.length, icon: iconName.icon })
                });
            })
        }
        setIconLikes(concatArr)

    }, [posts]);
    return iconLikes
}

