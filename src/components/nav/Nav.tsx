"use client"
import SubNav from "@component/nav/SubNav";
import styles from "@component/nav/nav.module.css";
import GeneralContextProvider from "../context/GeneralContextProvider";



export default function Nav() {


    return (
        <GeneralContextProvider>

            <main className={`${styles.navContainer}`} >
                <SubNav />
            </main>
        </GeneralContextProvider>
    )
}
