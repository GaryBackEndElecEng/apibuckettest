import bcrypt from "bcryptjs";
import { likeType, rateType, likeIcon, likeArr, pageHitType } from "./Types";



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
        const item = likes.find(like => like.name.includes(nam.name))
        if (item) {
            arr.push({ name: nam.name, icon: nam.icon, count: item.count })
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
export function calcPostHits(pageHits: pageHitType[], postId: number): number {
    let num = 0;
    const Page: string = `posts/${postId}`
    pageHits.map((page) => {
        if (page.page.includes(Page) && page.count) {
            num = num + page.count;
        }
    })
    return num
}
export function calcfileHits(pageHits: pageHitType[], fileId: string): number {
    let num = 0;
    const Page: string = `blogs/${fileId}`
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
                <p className={class_} key={index}>{pg}</p>
            )
        });
    }
    return retArr
}