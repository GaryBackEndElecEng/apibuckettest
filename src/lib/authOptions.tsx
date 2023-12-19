import { type NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaClient } from "@prisma/client";
import { hashKey, hashComp } from "@lib/ultils";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { userType } from "@lib/Types";
// const logo = `${process.env.NEXT_PUBLIC_aws}/logo.png`
const logo = `/images/gb_logo.png`;



// const prisma = new PrismaClient({datasourceUrl: process.env.DATABASE_URL_AWS})
const prisma = new PrismaClient()



const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials, }) {
            if (credentials) {
                return true
            } else if (account) return true
            // else if (isAllowedToSignIn) return true
            else return false

        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs: The redirect callback may be invoked more than once in the same flow.
            if (url.startsWith("/") || url.startsWith("/dashboard")) return `${baseUrl}${url}`

            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        async jwt({ token, user, account, profile, }) {

            // profile:null, user:protocol user

            return token
        },
        async session({ session, user, token }) {
            // console.log("session:user", user, token)// PROTOCOL USER
            //session is called when useSession/getServerSession
            // do {session:session,toke:token} for more info
            return session
        }



    },
    session: {
        strategy: "jwt"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_client_ID as string,
            clientSecret: process.env.GOOGLE_client_secret as string,
            // authorization: {
            //   params: {
            //     prompt: "consent",
            //     access_type: "offline",
            //     response_type: "code"
            //   }
            // }

        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
            // authorization: {
            //   params: {
            //     prompt: "consent",
            //     access_type: "offline",
            //     response_type: "code"
            //   }
            // }

        }),
        CredentialsProvider({

            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'log in',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "email", type: "text", placeholder: "email@mail.com" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                let cred = credentials
                // console.log("CRED", cred)//GOOD{email,password,csrfToken}
                if (cred && cred.email) {

                    const user = await prisma.user.findUnique({
                        where: {
                            email: cred.email
                        }
                    });
                    //   console.log(user)// worked
                    if (!user) {
                        await prisma.$disconnect()
                        return null
                    }
                    if (user.password) {
                        const check = await hashComp(cred?.password, user?.password) ? true : false;
                        if (!check) {
                            await prisma.$disconnect()
                            return null
                        }
                    }
                    // console.log("CRED USER", user)//GOOD
                    return { id: user.id, email: user.email, name: user.name }

                } else {
                    await prisma.$disconnect()
                    return null
                }

            }

        }),
        // ...add more providers here
    ],

    theme: {
        colorScheme: 'auto', // "auto" | "dark" | "light"
        brandColor: '#33FF5D', // Hex color code #33FF5D
        logo: logo, // Absolute URL to image
    },

    debug: process.env.NODE_ENV === "development"

}
export default authOptions;