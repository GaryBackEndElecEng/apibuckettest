import React from 'react';
import styles from "@component/blog/blog.module.css";
import Link from "next/link";

export default function Page() {
    const url = "/images/bgWave.png"
    return (
        <div className={`${styles.notFoundContainer} bg-slate-400`}>
            <div style={{ backgroundImage: `url(${url})` }}>
                <div>
                    <h2 className="text-2xl font-bold text-slate-100" style={{ color: "white" }}> sorry the page was not found</h2>
                    <Link href={"/"}>
                        <button className="buttonsm my-2 bg-black text-white">home</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
