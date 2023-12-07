import nodemailer from "nodemailer";
const email = process.env.EMAIL as string;
const pass = process.env.EMAIL_PASS as string;
const adminEmail = process.env.ADMINEMAIL as string
const file = "https://new-master.s3.ca-central-1.amazonaws.com/static/files/Resume.pdf"
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: adminEmail,
        pass
    }
});
export const mailOptions = (toEmail: string, arr_bcc: string[]) => {
    return ({
        from: email,
        to: toEmail,
        bcc: arr_bcc.concat([adminEmail, email]),
        html: 'Embedded image: <img src="https://new-master.s3.ca-central-1.amazonaws.com/static/masterultils/logo.png" alt="www.masterconnect.ca"/>',
        attachments: [{
            filename: 'resume',
            path: file,

        }]
    })
}