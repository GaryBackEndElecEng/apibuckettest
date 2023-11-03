export async function GET(req: Request) {
    return new Response(" yes its here")
}
export async function POST(req: Request) {
    const body = await req.json()
    // return new Response("ok", { status: 200 },JSON.stringify({body:body}))
    return new Response(JSON.stringify({ body: body }))
}