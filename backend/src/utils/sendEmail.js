import nodemailer from "nodemailer";
import createError from "./createError.js";

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `KernelChat <${process.env.EMAIL_USER}>`,
            to, subject, html
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw createError(500,"Email could not be sent.");
    }
}

export default sendEmail;