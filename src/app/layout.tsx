import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css';
import "@pages/globalsTwo.css";
import Nav from "@component/nav/Nav";
import Providers from "./providers";
import GeneralContextProvider from '@/components/context/GeneralContextProvider';
import BlogContextProvider from "@context/BlogContextProvider";
import PostContextProvider from "@context/PostContextProvider";



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-300 rootBody" >
        <Providers>
          <GeneralContextProvider>
            <BlogContextProvider>
              <PostContextProvider>
                <Nav />
                {children}
              </PostContextProvider>
            </BlogContextProvider>
          </GeneralContextProvider>
        </Providers>
      </body>
    </html>
  )
}
