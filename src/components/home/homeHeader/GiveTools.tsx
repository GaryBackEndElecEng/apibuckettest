"use client";
import React from 'react';
import styles from "./home2.module.css"

export default function GiveTools({ phr }: { phr: string | undefined }) {
    const [tools, setTools] = React.useState<boolean>(false);
    const toolref = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            let entry = entries[0];
            setTools(entry.isIntersecting)
        }, { threshold: 0.5 });
        if (phr && toolref.current) {
            observer.observe(toolref.current);
        }
    }, [phr]);

    return (
        <div ref={toolref}>
            <p className={tools ? styles.showTools : styles.hideTools}> {phr}</p>
        </div>
    )
}
