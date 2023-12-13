import Nav from '@component/nav/Nav'
import type { Metadata } from "next";

const metadata: Metadata = {
    title: "register",
    description: "ablogroom.com's registration page",

}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Nav />
            <main>{children}</main>

        </>
    )
}