const nodemailer = require('nodemailer');
const icalGenerator = require('ical-generator').default;  // Korrigierter Import

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
        //this.DIGEST_DELAY = 10 * 60 * 1000; // 10 Minuten
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

    createICalEvent(appointment) {
        console.log('[ICAL] Creating calendar event for appointment:', appointment);
        
        const calendar = icalGenerator({ name: 'Shanti Termine' });
        
        const [year, month, day] = appointment.date.split('-').map(num => parseInt(num));
        const [startHour, startMinute] = appointment.time.split(' - ')[0].split(':').map(num => parseInt(num));
        const [endHour, endMinute] = appointment.time.split(' - ')[1].split(':').map(num => parseInt(num));

        const startDate = new Date(year, month - 1, day, startHour, startMinute);
        const endDate = new Date(year, month - 1, day, endHour, endMinute);

        if (appointment.type === 'full') {
            endDate.setDate(endDate.getDate() + 1);
        }

        calendar.createEvent({
            start: startDate,
            end: endDate,
            summary: `Shanti - ${this.getAppointmentTypeText(appointment.type)}`,
            description: 'Hundesitting für Shanti',
            location: 'Bei Shanti',
            alarms: [
                { type: 'display', trigger: 3600 } // 1 Stunde vorher erinnern
            ]
        });

        console.log('[ICAL] Calendar event created successfully');
        return calendar;
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

            // Erstelle Kalenderanhänge für neue Termine
            const calendarAttachments = this.pendingChanges.newAppointments.map(app => {
                const calendar = this.createICalEvent(app);
                return {
                    filename: `shanti-termin-${app.date}.ics`,
                    content: calendar.toString(),
                    contentType: 'text/calendar'
                };
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_TO,
                subject: 'Shanti Terminplan Updates',
                attachments: calendarAttachments,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                            Shanti Terminplan Updates
                        </h2>
                        
                        ${this.pendingChanges.newAppointments.length > 0 ? `
                            <div style="margin-top: 20px; background-color: #f0fff4; padding: 15px; border-radius: 8px;">
                                <h3 style="color: #059669; margin-top: 0;">Neue Termine</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr style="background-color: #d1fae5;">
                                            <th style="padding: 10px; text-align: left;">Datum</th>
                                            <th style="padding: 10px; text-align: left;">Dienstart</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this.pendingChanges.newAppointments.map(app => `
                                            <tr>
                                                <td style="padding: 10px; border-bottom: 1px solid #d1fae5;">
                                                    ${this.formatDate(app.date)}
                                                </td>
                                                <td style="padding: 10px; border-bottom: 1px solid #d1fae5;">
                                                    ${this.getAppointmentTypeText(app.type)}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : ''}

                        ${this.pendingChanges.deletedAppointments.length > 0 ? `
                            <div style="margin-top: 20px; background-color: #fef2f2; padding: 15px; border-radius: 8px;">
                                <h3 style="color: #dc2626; margin-top: 0;">Gelöschte Termine</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr style="background-color: #fee2e2;">
                                            <th style="padding: 10px; text-align: left;">Datum</th>
                                            <th style="padding: 10px; text-align: left;">Dienstart</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this.pendingChanges.deletedAppointments.map(app => `
                                            <tr>
                                                <td style="padding: 10px; border-bottom: 1px solid #fee2e2;">
                                                    ${this.formatDate(app.date)}
                                                </td>
                                                <td style="padding: 10px; border-bottom: 1px solid #fee2e2;">
                                                    ${this.getAppointmentTypeText(app.type)}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : ''}
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