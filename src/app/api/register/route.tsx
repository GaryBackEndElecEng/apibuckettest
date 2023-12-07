import { NextRequest, NextResponse } from 'next/server';
import { transporter, mailOptions } from "@component/emails/nodemailer";
import { NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import { genHash } from "@lib/ultils";
import type { userType } from "@lib/Types";
import { getErrorMessage } from '@/lib/errorBoundaries';
import { NameSep } from "@lib/ultils"

const prisma = new PrismaClient();


export async function POST(
    req: NextRequest,
    res: NextApiResponse
) {

    const formdata = await req.formData();
    if (formdata) {
        const name: string | null = formdata.get("name") as string;
        const email: string | null = formdata.get("email") as string;
        const password = formdata.get("password");
        const hashPswd: string | undefined = await genHash(password as string);
        const imgKey: string | null = formdata.get("imgKey") as string


        try {
            const check = await prisma.user.findUnique({
                where: {
                    email: email as string
                }

            });
            if (check) {
                const updateUser = await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        name: name ? name.trim() : (check.name as string).trim(),
                        password: hashPswd ? hashPswd : check.password,
                        imgKey: imgKey ? imgKey : check.imgKey
                    }
                })
                return NextResponse.json({ message: "update", status: 200, user: `${JSON.stringify(updateUser)}` });
            } else {
                const user = await prisma.user.create({
                    data: {
                        name: name ? name.trim() : null,
                        email: email,
                        password: hashPswd,
                        imgKey: imgKey ? imgKey : null
                    }
                });
                await transporter.sendMail({
                    ...mailOptions(user.email, []),
                    subject: `Thank you for contacting us!`,
                    text: generateText(user as unknown as userType),
                    html: generateHTML(user as unknown as userType)
                });
                return NextResponse.json({ status: 200, user: `${JSON.stringify(user)}`, message: "created" })
            }
        } catch (error) {
            const message = getErrorMessage(error)
            return NextResponse.json({ status: 500, message: `server issue@register: ${message}`, user: "" });
        } finally {
            await prisma.$disconnect()
        }

    } else {
        return NextResponse.json({ status: 400, message: "bad request@register- no data recieved", user: "" })
    }

}
const generateText = (user: userType) => {
    return (
        `<h1>Community member</h1>
    <br>
    <h4>${NameSep(user.name as string)}</h4>
    <p>Thank you for registering with us. You now have the power of creating AMAZING blogs free of charge.</p>
    <p>We will email on upgrades and or changes. We will always keep your data preserved and ensure the highest security. your email @: ${user.email}</p>
    <br>
    <h3> brught to you by Gary Wallace</h3>
    <a href="emailto:masterultils.com"> email me when ever</a>
    <p>Delete your account :<a href="https://www.ablogroom.com/deletedAccount?email=${user.email}" >delete account</a></p>
    `
    )
}
export const generateHTML = (user: userType) => {
    return (
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you Mr. ${NameSep(user.name as string)} for registering</title>
            <style>
                body{
                    border-radius:10px;
                    box-shadow:1px 1px 5px 20px grey,-1px -1px -5px 20px grey;
                    margin-inline:2rem;
                    padding-inline:1.5rem;
                    display:flex;
                    flex-direction: column;
                    justify-content:center;
                    align-items:center;
                    gap:1rem;
                }
                h4{
                    color:blue;
                }
                h1{ font:"bold";text-decoration:underline;text-underline-offset: 3;}
                .masterultils{
                    
                    margin-block:20px;
                    padding-block:20px;
                    border-radius:10%;
                }
                .flexrow{
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    gap:1rem;
                }
                p{margin-block:10px}
                .list{
                    margin-block:20px;
                    background:white;
                    border-radius:10px;
                    padding:7px;
                    box-shadow:1px 1px 5px 20px grey,-1px -1px -5px 20px grey;
                }
                div.lineBreak{
                    height:5px;
                    background:linear-gradient(to left,orange,blue);
                    width:75%;
                    margin-block:1.5rem;
                    margin-bottom:2rem;
                }
                a{
                    margin-block:1rem;
                }
                img{
                    max-width:400px;
                    aspect-ratio:16 / 9;
                    padding:1rem;
                    border-radius: 30px 30px 30px 30px;
                    box-shadow:1px 1px 10px 2px black;
                }
            </style>
        </head>
        <html>
            <div class="lineBreak"></div>
            <div class="flexrow">
            <h2>Community member</h2>
            <h4> confirmed:${NameSep(user.name as string)}</h4>
        </div>
            <div class="lineBreak"></div>
            <p>Please let us know if you required any additional improvements to the blog.</p>
            <p>We will, always, keep you in the loop on improvements.</p>
            
            <h4> additional interesting things you might like</h4>
            <ul class="list">
                <li><a href="https://www.masterultils.com/articles">articles</a></li>
                <li><a href="https://www.ablogroom.com/register">register</a></li>
                <li><a href="https://www.masterconnect.ca/design">Dynamic Designs</a></li>
            </ul>
            
            <div class="masterultils text-align-center flex-col items-center gap-2">
            <a href="www.masterconnect.ca">Designs@masterconnect.ca</a>
            <p>email sponsor:<a href="emailto:masterultils@gmail.com"> email</a></p>
                <img src="https://www.ablogroom.com/images/gb_logo.png" alt="www.masterconnect.ca"
                />
            </div>
            <br/>
            <div class="lineBreak"></div>
            <p>Delete your account :<a href="https://www.ablogroom.com/deletedAccount?email=${user.email}" >delete account</a></p>
            
            <div class="lineBreak"></div>
        </body>
        </html>
    `
    )
}