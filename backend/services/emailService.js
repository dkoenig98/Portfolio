const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        console.log('[EMAIL_SERVICE] Initializing EmailService');
        try {
            const emailConfig = {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
                to: process.env.EMAIL_TO
            };
            console.log('[EMAIL_CONFIG] Checking email configuration');

            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            console.log('[EMAIL_SERVICE] Created transporter successfully');
        } catch (error) {
            console.error('[EMAIL_SERVICE_ERROR] Failed to create transporter:', error);
        }

        this.pendingChanges = {
            newAppointments: [],
            deletedAppointments: []
        };
        this.digestTimeout = null;
        this.DIGEST_DELAY = 30 * 1000; // 30 Sekunden für Tests    
      //this.DIGEST_DELAY = 10 * 60 * 1000; // 10 Minuten
    }

    addChange(appointment, type = 'new') {
        console.log(`[EMAIL_SERVICE] Adding ${type} change for appointment:`, appointment);
        
        // Filtern von Fortsetzungsterminen bei 24h-Diensten
        if (appointment.parentDate) {
            console.log('[EMAIL_SERVICE] Skipping continuation appointment');
            return;
        }

        if (type === 'new') {
            this.pendingChanges.newAppointments.push(appointment);
        } else if (type === 'delete') {
            this.pendingChanges.deletedAppointments.push(appointment);
        }

        if (this.digestTimeout) {
            clearTimeout(this.digestTimeout);
        }

        this.digestTimeout = setTimeout(() => {
            this.sendDigestEmail();
        }, this.DIGEST_DELAY);
    }

    getAppointmentTypeText(type) {
        const types = {
            'regular': 'Tagdienst (07:00 - 15:30)',
            'full': '24h Dienst (07:00 - 07:00 nächster Tag)',
            'late': 'Spätdienst (10:00 - 18:30)',
            'extended': 'Langdienst (08:00 - 18:30)'
        };
        return types[type] || type;
    }

    formatDate(date, type) {
        const formattedDate = new Date(date).toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if (type === 'full') {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const formattedNextDay = nextDay.toLocaleDateString('de-DE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
            return `${formattedDate} bis ${formattedNextDay}`;
        }

        return formattedDate;
    }

    async sendDigestEmail() {
        if (this.pendingChanges.newAppointments.length === 0 && 
            this.pendingChanges.deletedAppointments.length === 0) {
            return;
        }

        try {
            const sortByDate = (a, b) => new Date(a.date) - new Date(b.date);
            this.pendingChanges.newAppointments.sort(sortByDate);
            this.pendingChanges.deletedAppointments.sort(sortByDate);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_TO,
                subject: 'Shanti Terminplan Updates',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Shanti´s Kindergarten</title>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
                        <div style="width: 100%; max-width: 600px; margin: 20px auto; padding: 10px;">
                            <div style="background-color: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                                <!-- Header -->
                                <div style="background-color: #1a73e8; padding: 25px 20px;">
                                    <h1 style="color: white; margin: 0; text-align: center; font-family: Arial, sans-serif; font-size: 24px;">
                                        Änderungen bei Shanti's Kindergarten
                                    </h1>
                                </div>

                                <!-- Content Container -->
                                <div style="padding: 20px;">
                                    ${this.pendingChanges.newAppointments.length > 0 ? `
                                        <div style="margin-bottom: 30px;">
                                            <div style="background-color: #e6f4ea; border-radius: 8px; padding: 16px; margin-bottom: 10px;">
                                                <h2 style="color: #1e8e3e; margin: 0; font-family: Arial, sans-serif; font-size: 18px;">
                                                    🆕 Neue Termine
                                                </h2>
                                            </div>
                                            <div style="overflow-x: auto;">
                                                <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                                                    ${this.pendingChanges.newAppointments.map(app => `
                                                        <tr style="background-color: #ffffff;">
                                                            <td style="padding: 16px; border-bottom: 1px solid #e0e0e0; font-family: Arial, sans-serif;">
                                                                <div style="font-weight: 600; color: #202124; margin-bottom: 4px;">
                                                                    ${this.formatDate(app.date, app.type)}
                                                                </div>
                                                                <div style="color: #5f6368; font-size: 14px;">
                                                                    ${this.getAppointmentTypeText(app.type)}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    `).join('')}
                                                </table>
                                            </div>
                                        </div>
                                    ` : ''}

                                    ${this.pendingChanges.deletedAppointments.length > 0 ? `
                                        <div>
                                            <div style="background-color: #fce8e8; border-radius: 8px; padding: 16px; margin-bottom: 10px;">
                                                <h2 style="color: #d93025; margin: 0; font-family: Arial, sans-serif; font-size: 18px;">
                                                    ❌ Gelöschte Termine
                                                </h2>
                                            </div>
                                            <div style="overflow-x: auto;">
                                                <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                                                    ${this.pendingChanges.deletedAppointments.map(app => `
                                                        <tr style="background-color: #ffffff;">
                                                            <td style="padding: 16px; border-bottom: 1px solid #e0e0e0; font-family: Arial, sans-serif;">
                                                                <div style="font-weight: 600; color: #202124; margin-bottom: 4px;">
                                                                    ${this.formatDate(app.date, app.type)}
                                                                </div>
                                                                <div style="color: #5f6368; font-size: 14px;">
                                                                    ${this.getAppointmentTypeText(app.type)}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    `).join('')}
                                                </table>
                                            </div>
                                        </div>
                                    ` : ''}

                                    <!-- Footer -->
                                    <div style="margin-top: 30px; text-align: center; color: #5f6368; font-size: 13px; font-family: Arial, sans-serif; padding-top: 20px; border-top: 1px solid #f1f3f4;">
                                        Automatische Benachrichtigung von Shanti´s Kindergarten
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('[EMAIL_SERVICE] Email sent successfully');
            
            this.pendingChanges = {
                newAppointments: [],
                deletedAppointments: []
            };
        } catch (error) {
            console.error('[EMAIL_ERROR] Failed to send digest email:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();