" use client";
import { SiGnuprivacyguard } from "react-icons/si";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from '@mui/icons-material/Explore';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "@component/nav/nav.module.css"
import React from "react";

export default function DropDownTrigger() {
    const { data, status } = useSession()
    const [check, setCheck] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [name, setName] = React.useState<string>()

    React.useEffect(() => {
        if (status === "authenticated") {
            setCheck(true)
        }
        if (status === "loading") {
            setIsLoading(true);
        } else { setIsLoading(false) }

    }, [status]);
    React.useEffect(() => {
        if (data && data.user && data.user.name) {
            setName(data.user.name)
        }

    }, [data]);

    return (
        <main className={isLoading ? styles.loading : styles.notLoading}>
            {check ?
                <div className={styles.isSignedIn}>
                    <small>{name && name}</small>

                    <button className={styles.btnSmall}
                        onClick={() => signOut()}
                    >signout</button>

                </div>
                :
                <div className={styles.subLoading} >
                    <Link href={"/api/auth/signin"} data-link={" sign up with a provider"}>
                        <button className={styles.btnSmall}>
                            <SiGnuprivacyguard sx={{ backround: "black", color: "white", mr: "2px" }} />
                            signup</button>
                    </Link>
                    <Link href={"/register"} data-link={"sign up using name and pswd."}>
                        <button className={styles.btnSmall} >
                            <SiGnuprivacyguard sx={{ backround: "black", color: "white", mr: "2px" }} />
                            register</button>
                    </Link>

                </div>
            }
        </main>
    )
}