import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react"

interface Prop {
  Component: any,
  pageProps: {
    session: Session,
  }
}
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: Prop) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}