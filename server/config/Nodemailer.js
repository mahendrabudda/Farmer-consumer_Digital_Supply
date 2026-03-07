import nodemailer from 'nodemailer';
console.log("SMTP USER:", process.env.SMTP_USER); // 👈 Add this temporarily to debug
console.log("SMTP PASS:", process.env.SMTP_PASS ? "EXISTS" : "MISSING");

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // Use false for 587, true for 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Add this to help debug if it fails again
    debug: true, 
    logger: true 
});

export default transporter;