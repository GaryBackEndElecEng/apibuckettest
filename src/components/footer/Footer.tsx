"use client"
import React from 'react';
import styles from "./footer.module.css";
import GenContact from "./GenContact";
import { useHits } from "@lib/ultils";
import { usePathname } from "next/navigation";
import type { retType } from "@lib/Types";

export default function Footer() {
    const pathname = usePathname();
    const { total, pageArr } = useHits();
    const bgWave = "/images/bgWave.png";
    const [getPageHits, setGetPageHits] = React.useState<retType | undefined>();
    const [contactBtn, setContactBtn] = React.useState(false);

    React.useEffect(() => {
        const pageCount = pageArr.find(page => (page.page === pathname))
        if (!pageCount) return
        setGetPageHits(pageCount)
    }, [pageArr, pathname]);
    return (
        <div className={`${styles.mainFooterContainer} bg-slate-400`} style={{ backgroundImage: `url(${bgWave})` }}>
            <div className={styles.footerGrid}>

                <div className={styles.one}><h1>one</h1></div>
                <div className={styles.two}>
                    <small>hits:{total}/ {getPageHits && getPageHits.count} </small>

                    <h1>@copyright@{new Date().getFullYear()}</h1>
                </div>

                <div className={styles.three}>
                    {contactBtn && <GenContact setContactBtn={setContactBtn} />}
                    {!contactBtn &&
                        <button className="buttonsm bg-black text-white" onClick={() => setContactBtn(true)}>contact us</button>
                    }

                </div>
            </div>
        </div>
    )
}
