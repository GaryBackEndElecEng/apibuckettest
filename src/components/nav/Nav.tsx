import SubNav from "@component/nav/SubNav";
import styles from "@component/nav/nav.module.css";


export default function Nav() {


    return (
        <main className={`${styles.navContainer}`} style={{ border: "1px solid orange" }}>
            <SubNav />
        </main>
    )
}
