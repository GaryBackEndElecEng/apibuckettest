


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
export type userType = {
    id?: string,
    name: string | null,
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
    imageUrl: string | null
}
export type postType = {
    id?: number,
    name: string,
    content: string,
    imageUrl: string | null,
    s3Key: string | null,
    date?: Date,
    userId: string,
    bloglink: string | null
}
export type contactType = {
    id?: number,
    email: string,
    subject: string,
    content: string,
    userId: string
}
export type msgType = {
    loaded: boolean,
    msg: string | undefined
}
export type generalInfoType = {
    id: number,
    category: string,
    name: string,
    url: string,
    desc: string
}
export type rateType = {
    id: number,
    rate: number,
    fileId: string,
    postId: number
}
export type likeType = {
    id: number,
    name: string,
    fileId: string,
    postId: number
}
export type pageHitType = {
    id?: number,
    page: string
    count?: number,
    date?: Date
    name: string
}