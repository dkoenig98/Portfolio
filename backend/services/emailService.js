const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendAppointmentNotification(appointment) {
        const date = new Date(appointment.date);
        const formattedDate = date.toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const typeMap = {
            regular: 'Tagdienst',
            full: '24h Dienst',
            night: 'Nachtdienst'
        };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: 'Neuer Shanti Termin',
            html: `
                <h2>Neuer Termin wurde erstellt</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 10px; text-align: left;">Datum</th>
                        <td style="padding: 10px;">${formattedDate}</td>
                    </tr>
                    <tr>
                        <th style="padding: 10px; text-align: left;">Dienstart</th>
                        <td style="padding: 10px;">${typeMap[appointment.type]}</td>
                    </tr>
                    <tr>
                        <th style="padding: 10px; text-align: left;">Zeit</th>
                        <td style="padding: 10px;">${appointment.time}</td>
                    </tr>
                </table>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Email wurde sofort gesendet');
        } catch (error) {
            console.error('Email Fehler:', error);
        }
    }
}

module.exports = new EmailService();