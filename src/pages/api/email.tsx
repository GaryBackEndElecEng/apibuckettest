import { transporter, mailOptions } from "@component/emails/nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import type { contactType, userType } from "@lib/Types";
import { getErrorMessage } from "@/lib/errorBoundaries";

const prisma = new PrismaClient();

const generateText = (contact: contactType, user: userType) => {
    return (
        `<h1>Community member</h1>
    <br>
    <h4>${contact.subject}</h4>
    <p>We are always updating our free services and will let you know when, new services are available</p>
    <p>We will email as soon as new services become available to your email @: ${contact.email}</p>
    <br>
    <br>
    <p> ${user.bio}/p>
    <a href="www.masterconncet.ca">master connect</a>
    <p>email: ${user.email}</p>`
    )
}
export const generateHTML = (contact: contactType, user: userType) => {
    return (
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you for registering</title>
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
            <h4> author: ${user.name}</h4>
        </div>
            <div class="lineBreak"></div>
            <p>${user.name} is working hard on updating / creating new blogs</p>
            <p>We will let keep you in the loop.</p>
            
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
            <p>To unsubscribe :<a href="https://www.ablogroom.com/unsubscribe?email=${contact.email}" >unsubscribe</a></p>
            
            <div class="lineBreak"></div>
        </body>
        </html>
    `
    )
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const Contact = JSON.parse(req.body) as contactType;
        if (!(Contact.email && Contact.userId)) {
            res.status(302).json({ message: "I think you forgot something" })
        }
        try {
            const author = await prisma.user.findUnique({
                where: {
                    id: Contact.userId
                }
            });
            if (author) {
                const contact = await prisma.contact.upsert({
                    create: {
                        subject: Contact.subject,
                        content: Contact.content,
                        email: Contact.email,
                        userId: author.id
                    },
                    update: {
                        subject: Contact.subject,
                        content: Contact.content,
                        email: Contact.email,
                        userId: author.id
                    },
                    where: {
                        email: Contact.email
                    }

                });
                if (contact) {
                    await transporter.sendMail({
                        ...mailOptions(contact.email, [author.email]),
                        subject: `Thank you for contacting us!`,
                        text: generateText(contact, author as unknown as userType),
                        html: generateHTML(contact, author as unknown as userType)
                    });
                    await prisma.$disconnect();
                    return res.status(200).json({ contact: contact, message: "sent" });
                }

            }
        } catch (error) {
            const msg = getErrorMessage(error);
            console.log(`${msg}@email@nodemailer`)
            res.status(400).json({ message: `${msg}@email@nodemailer` })
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.status(400).json({ message: "Bad request" })
    }
}
export default handler;