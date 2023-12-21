"use client"
import React from 'react';
import styles from "./footer.module.css";
import GenContact from "./GenContact";
import { useHits } from "@lib/ultils";
import { usePathname } from "next/navigation";
import type { retType } from "@lib/Types";
import FooterHeader from './FooterHeader';
import PrivacyService from "./PrivacyService";

export default function Footer() {
    const logoHeader = "/images/logo_500.png";
    const pathname = usePathname();
    const { total, pageArr } = useHits();
    const bgWave = "/images/bgWave.png";
    const [getPageHits, setGetPageHits] = React.useState<retType | undefined>();
    const [contactBtn, setContactBtn] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const pageCount = pageArr.find(page => (page.page === pathname))
        if (!pageCount) return
        setGetPageHits(pageCount)
    }, [pageArr, pathname]);
    return (
        <div className={`${styles.mainFooterContainer} bg-slate-400`} style={{ backgroundImage: `url(${bgWave})` }}>
            <div className={styles.footerGrid}>

                <div className={styles.one}><FooterHeader logo={logoHeader} /></div>
                <div className={styles.two}>
                    <small>hits:{total}/ {getPageHits && getPageHits.count} </small>

                    <h1>@copyright@{new Date().getFullYear()}</h1>

                </div>

                <div className={styles.three}>
                    {contactBtn && <GenContact setContactBtn={setContactBtn} />}
                    {!contactBtn &&
                        <button className="buttonsm bg-black text-white" onClick={() => setContactBtn(true)}>contact us</button>
                    }
                    <h4>www.ablogroom.com</h4>
                    <div>
                        <h2>policies</h2>
                        {open ? (
                            <button className="buttonsm px-3 py-1 bg-slate-800 text-white" onClick={() => setOpen(false)}>close</button>
                        ) : (
                            <button className="buttonsm px-3 py-1 bg-slate-800 text-white" onClick={() => setOpen(true)}>open</button>
                        )}
                        <PrivacyService open={open} />
                    </div>
                </div>
            </div>
        </div>
    )
}
