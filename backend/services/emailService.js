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
            console.log('[EMAIL_CONFIG] Checking email configuration:', {
                hasUser: !!emailConfig.user,
                hasPass: !!emailConfig.pass,
                hasTo: !!emailConfig.to
            });

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
    }

    addChange(appointment, type = 'new') {
        console.log(`[EMAIL_SERVICE] Adding ${type} change for appointment:`, appointment);
        
        if (type === 'new') {
            this.pendingChanges.newAppointments.push(appointment);
        } else if (type === 'delete') {
            this.pendingChanges.deletedAppointments.push(appointment);
        }

        if (this.digestTimeout) {
            console.log('[EMAIL_SERVICE] Clearing existing digest timeout');
            clearTimeout(this.digestTimeout);
        }

        console.log(`[EMAIL_SERVICE] Setting new digest timeout for ${this.DIGEST_DELAY/1000} seconds`);
        this.digestTimeout = setTimeout(() => {
            console.log('[EMAIL_SERVICE] Digest timeout triggered');
            this.sendDigestEmail();
        }, this.DIGEST_DELAY);
    }

    getAppointmentTypeText(type) {
        const types = {
            'regular': 'Tagdienst (07:00 - 15:30)',
            'full': '24h Dienst (07:00 - 09:00)',
            'late': 'Spätdienst (10:00 - 18:30)',
            'extended': 'Langdienst (08:00 - 18:30)'
        };
        return types[type] || type;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async sendDigestEmail() {
        console.log('[EMAIL_SERVICE] Starting digest email process');
        console.log('[EMAIL_SERVICE] Current pending changes:', {
            newCount: this.pendingChanges.newAppointments.length,
            deleteCount: this.pendingChanges.deletedAppointments.length
        });
        
        if (this.pendingChanges.newAppointments.length === 0 && 
            this.pendingChanges.deletedAppointments.length === 0) {
            console.log('[EMAIL_SERVICE] No changes to send');
            return;
        }

        try {
            // Sortiere nach Datum
            const sortByDate = (a, b) => new Date(a.date) - new Date(b.date);
            this.pendingChanges.newAppointments.sort(sortByDate);
            this.pendingChanges.deletedAppointments.sort(sortByDate);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_TO,
                subject: 'Shanti Terminplan Updates',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
                        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h1 style="color: #1a73e8; margin-top: 0; text-align: center; border-bottom: 2px solid #f1f3f4; padding-bottom: 15px;">
                                Shanti Terminplan Updates
                            </h1>
                            
                            ${this.pendingChanges.newAppointments.length > 0 ? `
                                <div style="margin-top: 25px; background-color: #e6f4ea; padding: 20px; border-radius: 8px; border-left: 4px solid #1e8e3e;">
                                    <h2 style="color: #1e8e3e; margin-top: 0; font-size: 18px;">🆕 Neue Termine</h2>
                                    <div style="overflow-x: auto;">
                                        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px;">
                                            <thead>
                                                <tr style="background-color: rgba(30, 142, 62, 0.1);">
                                                    <th style="padding: 12px; text-align: left; border-top-left-radius: 8px;">Datum</th>
                                                    <th style="padding: 12px; text-align: left; border-top-right-radius: 8px;">Dienstart</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${this.pendingChanges.newAppointments.map(app => `
                                                    <tr style="border-bottom: 1px solid #e0e0e0;">
                                                        <td style="padding: 12px; font-weight: 500;">
                                                            ${this.formatDate(app.date)}
                                                        </td>
                                                        <td style="padding: 12px;">
                                                            ${this.getAppointmentTypeText(app.type)}
                                                        </td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ` : ''}

                            ${this.pendingChanges.deletedAppointments.length > 0 ? `
                                <div style="margin-top: 25px; background-color: #fce8e8; padding: 20px; border-radius: 8px; border-left: 4px solid #d93025;">
                                    <h2 style="color: #d93025; margin-top: 0; font-size: 18px;">❌ Gelöschte Termine</h2>
                                    <div style="overflow-x: auto;">
                                        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px;">
                                            <thead>
                                                <tr style="background-color: rgba(217, 48, 37, 0.1);">
                                                    <th style="padding: 12px; text-align: left; border-top-left-radius: 8px;">Datum</th>
                                                    <th style="padding: 12px; text-align: left; border-top-right-radius: 8px;">Dienstart</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${this.pendingChanges.deletedAppointments.map(app => `
                                                    <tr style="border-bottom: 1px solid #e0e0e0;">
                                                        <td style="padding: 12px; font-weight: 500;">
                                                            ${this.formatDate(app.date)}
                                                        </td>
                                                        <td style="padding: 12px;">
                                                            ${this.getAppointmentTypeText(app.type)}
                                                        </td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div style="margin-top: 25px; text-align: center; color: #666; font-size: 14px; padding-top: 15px; border-top: 1px solid #f1f3f4;">
                                Dies ist eine automatisch generierte Nachricht vom Shanti Terminplan System
                            </div>
                        </div>
                    </div>
                `
            };

            console.log('[EMAIL_SERVICE] Attempting to send email');
            await this.transporter.sendMail(mailOptions);
            console.log('[EMAIL_SERVICE] Email sent successfully');
            
            // Liste leeren nach erfolgreichem Versand
            this.pendingChanges = {
                newAppointments: [],
                deletedAppointments: []
            };
        } catch (error) {
            console.error('[EMAIL_ERROR] Failed to send digest email:', {
                message: error.message,
                stack: error.stack,
                code: error.code
            });
            throw error;
        }
    }
}

module.exports = new EmailService();