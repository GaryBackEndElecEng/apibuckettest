import { Redirect } from "next"
import React from "react";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";
import { FaSmileBeam } from "react-icons/fa";
import { MdGppGood } from "react-icons/md";
import { IoCheckmarkOutline } from "react-icons/io5";


export type accountType = {
    id?: string,
    userId: string,
    type?: string,
    provider: string,
    providerAccountId: string,
    refresh_token: string | null,
    access_token: string | null,
    expires_at: number | null,
    token_type: string | null,
    scope: string | null,
    id_token: string | null,
    session_state: string | null
}
export type sessionType = {
    id?: string,
    sessionToken: string,
    userId: string,
    expires: Date,
}
export type inputType = {
    id?: number,
    name: string,
    content: string,
    type: string,
    url: string | null,
    s3Key: string | null,
    fileId: string,
    date?: Date
}
export type userType = {
    id?: string,
    name?: string,
    email: string,
    password: string | null,
    emailVerified: Date | null,
    image: string | null,
    imgKey: string | null,
    bio: string | null,
    accounts: accountType[],
    sessions: sessionType[]
    files: fileType[]
    contacts: contactType[]
    posts: postType[]
}
export type fileType = {
    id?: string,
    name: string,
    title: string,
    content: string,
    fileUrl: string,
    published: boolean,
    date?: Date,
    userId: string,
    imageKey: string | null,
    imageUrl: string | null,
    inputs: inputType[],
    likes: fileLikeType[],
    rates: fileRateType[]
}
export type postType = {
    id?: number,
    name: string,
    content: string,
    imageUrl: string | null,
    s3Key: string | null,
    date?: Date,
    userId: string,
    bloglink: string | null,
    likes: postLikeType[],
    rates: postRateType[]
}
export type blogLinkType = {
    fileId: string,
    name: string,
    title: string
}
export type contactType = {
    id?: number,
    email: string,
    subject: string,
    content: string,
    userId: string
}
export type genContactType = {
    id?: number,
    email: string,
    subject: string,
    content: string,
}
export type msgType = {
    loaded: boolean,
    msg: string | undefined
} | undefined
export type generalInfoType = {
    id: number,
    category: string,
    name: string,
    url: string,
    desc: string
}
export type rateType = {
    id?: number,
    rate: number,
}
export type likeType = {
    id?: number,
    name: string,
    count: number,
}
export type postRateType = {
    id?: number,
    rate: number,
    postId: number
}
export type postLikeType = {
    id?: number,
    name: string,
    count: number,
    postId: number
}
export type fileRateType = {
    id?: number,
    rate: number,
    fileId: string
}
export type fileLikeType = {
    id?: number,
    name: string,
    count: number,
    fileId: string
}
export type likeIcon = {
    name: string,
    count: number,
    icon: React.ReactNode
}
export type nameRateType = {
    name: string,
    avRate: number,
    count: number
}
export const likeArr: { name: string, icon: React.ReactNode }[] = [
    { name: "happy", icon: <FaSmileBeam /> },
    { name: "thumbUp", icon: <FaRegThumbsUp /> },
    { name: "thumbDown", icon: <FaThumbsDown /> },
    { name: "great", icon: <MdGppGood /> },
    { name: "average", icon: <IoCheckmarkOutline /> },
]
export type pageHitType = {
    id?: number,
    page: string
    count: number,
    date?: Date
    name: string
}
export type retType = {
    page: string,
    count: number
}
export type navLinkType = {
    id: number,
    icon: React.ReactNode,
    name: string,
    image: string,
    link: string,
    desc: string
}
export type GetServerSidePropsResult<P> =
    | { props: P | Promise<P> }
    | { redirect: Redirect }
    | { notFound: true }

export const inputNames: inputType[] = [
    { type: "image", name: "fill", content: "fill", url: null, s3Key: null, fileId: "fill" },
    { type: "heading", name: "fill", content: "fill", url: null, s3Key: null, fileId: "fill" },
    { type: "subHeading", name: "fill", content: "fill", url: null, s3Key: null, fileId: "fill" },
    { type: "section", name: "fill", content: "fill", url: null, s3Key: null, fileId: "fill" },
    { type: "list", name: "fill", content: "fill", url: null, s3Key: null, fileId: "fill" },
    { type: "link", name: "fill", content: "fill", url: null, s3Key: null, fileId: "fill" },
    { type: "article", name: "fill", content: "fill", url: null, s3Key: null, fileId: "fill" },
    { type: "conclusion", name: "fill", content: "fill", url: null, s3Key: null, fileId: "fill" },
    { type: "reply", name: "fill", content: "fill", url: null, s3Key: null, fileId: "fill" },
]
export type targetType = {
    loaded: boolean,
    id: number | null
}