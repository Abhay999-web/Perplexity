import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    },
    family: 4,
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
    tls: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true
    }
});

const verifyTransporter = async () => {
    try {
        await transporter.verify();
        console.log("Email transporter is ready to send emails");
    } catch (error) {
        console.error("Email transporter verification failed:", error);
    }
};

verifyTransporter();

export async function sendEmail({ to, subject, html, text }) {
    try {
        const mailOptions = {
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        };

        const details = await transporter.sendMail(mailOptions);
        console.log("Email sent:", details.response || details);
        return details;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
}














