// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     auth: {
//         type: "OAuth2",
//         user: process.env.GOOGLE_USER,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN
//     },
//     family: 4,
//     connectionTimeout: 20000,
//     greetingTimeout: 20000,
//     socketTimeout: 20000,
//     tls: {
//         minVersion: "TLSv1.2",
//         rejectUnauthorized: true
//     }
// });

// const verifyTransporter = async () => {
//     try {
//         await transporter.verify();
//         console.log("Email transporter is ready to send emails");
//     } catch (error) {
//         console.error("Email transporter verification failed:", error);
//     }
// };

// verifyTransporter();

// export async function sendEmail({ to, subject, html, text }) {
//     try {
//         const mailOptions = {
//             from: process.env.GOOGLE_USER,
//             to,
//             subject,
//             html,
//             text
//         };

//         const details = await transporter.sendMail(mailOptions);
//         console.log("Email sent:", details.response || details);
//         return details;
//     } catch (error) {
//         console.error("Email sending failed:", error);
//         throw error;
//     }
// }















//testing the smtp connection
import nodemailer from "nodemailer";
import dns from "dns";


dns.lookup("smtp.gmail.com", (err, address) => {
    if (err) {
        console.error("DNS Error:", err);
    } else {
        console.log("SMTP IP:", address);
    }
});


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});


async function verifyTransporter() {
    try {
        console.log("Verifying SMTP transporter...");

        await transporter.verify();

        console.log(" Email transporter is ready.");
    } catch (error) {
        console.error(" Email transporter verification failed.");
        console.error(error);
    }
}

verifyTransporter();

export async function sendEmail({ to, subject, html, text }) {
    try {
        const info = await transporter.sendMail({
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text,
        });

        console.log("Email sent:", info.response);
        return info;
    } catch (error) {
        console.error(" Email sending failed:");
        console.error(error);
        throw error;
    }
}