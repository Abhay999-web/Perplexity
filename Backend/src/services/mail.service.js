import axios from "axios";

export async function sendEmail({ to, subject, html, text }) {
    try {
        
        const payload = {
            sender: {
                email: process.env.BREVO_SENDER_EMAIL, 
                name: process.env.BREVO_SENDER_NAME || "Perplexity Clone"
            },
            to: [
                { email: to }
            ],
            subject: subject,
            htmlContent: html,
        };

        payload.textContent = text ? text : "Please view this email in an HTML compatible email client.";

        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            payload,
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Email sent successfully :", response.data);
        return response.data;

    } catch(error) {
        console.error("Brevo API Email Error :", error.response?.data || error.message);
        throw error;
    }
}