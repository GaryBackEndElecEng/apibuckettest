import { NextRequest, NextResponse } from "next/server";
import authOptions from "@lib/authOptions";
import { getServerSession } from "next-auth";



export async function middleware(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.redirect("/register")
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*"]
}