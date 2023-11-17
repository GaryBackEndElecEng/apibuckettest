import Nav from '@component/nav/Nav'


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Nav />
            <main>{children}</main>

        </>
    )
}