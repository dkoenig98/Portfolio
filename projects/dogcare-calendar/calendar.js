class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.appointments = {};
        this.longPressTimer = null;
        this.longPressDelay = 1000;
        this.touchstartX = 0;
        this.touchstartY = 0;
        this.touchendX = 0;
        this.touchendY = 0;
        
        this.auth = new Auth();
        this.api = new DogCareAPI(this.auth);
        
        if (this.auth.isLoggedIn()) {
            this.showCalendar();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('calendarSection').style.display = 'none';
        this.setupLoginHandler();
    }

    showCalendar() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('calendarSection').style.display = 'block';
        this.init();
    }

    setupLoginHandler() {
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (await this.auth.login(username, password)) {
                this.showCalendar();
            } else {
                alert('Login fehlgeschlagen');
            }
        });
    }

    async init() {
        this.appointments = await this.api.fetchAppointments();
        this.renderCalendar();
        this.attachEventListeners();
        this.setupSwipeHandler();
        this.addLogoutButton();
    }

    addLogoutButton() {
        const header = document.querySelector('.header');
        const logoutButton = document.createElement('button');
        logoutButton.className = 'logout-button';
        logoutButton.textContent = 'Abmelden';
        logoutButton.onclick = () => {
            this.auth.logout();
            this.showLogin();
        };
        header.appendChild(logoutButton);
    }

    formatDate(date) {
        return date.toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateString(year, month, day) {
        return `${year}-${month}-${day}`;
    }

    getNextDay(dateStr) {
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 1);
        return this.formatDateString(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        );
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const monthEl = document.getElementById('currentMonth');
        monthEl.textContent = new Date(year, month).toLocaleString('de-DE', { 
            month: 'long', 
            year: 'numeric' 
        });

        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        let firstDayIndex = firstDay.getDay() || 7;
        
        for (let i = 1; i < firstDayIndex; i++) {
            this.createEmptyDay(calendar);
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            this.createDay(calendar, day, year, month);
        }
    }

    createEmptyDay(calendar) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'empty-day';
        calendar.appendChild(emptyDay);
    }

    createDay(calendar, day, year, month) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        const dateStr = this.formatDateString(year, month + 1, day);
        const appointment = this.appointments[dateStr];
        
        const isContinuation = appointment && appointment.parentDate;
        
        if (appointment && !isContinuation) {
            dayElement.classList.add(`${appointment.type}-duty`);
            dayElement.title = `${appointment.time}`;

            if (appointment.type === 'night' || appointment.type === 'full') {
                const nextDateStr = this.getNextDay(dateStr);
                this.appointments[nextDateStr] = {
                    type: `${appointment.type}`,
                    time: 'Fortsetzung vom Vortag',
                    parentDate: dateStr
                };
            }
        } else if (isContinuation) {
            dayElement.classList.add(`${appointment.type}-duty`);
            dayElement.classList.add('continuation');
            dayElement.title = appointment.time;
        }

        const today = new Date();
        if (day === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayElement.classList.add('today');
        }

        this.setupDayTouchEvents(dayElement, dateStr);

        if (window.innerWidth >= 768) {
            dayElement.addEventListener('click', (e) => {
                if (!this.isLongPress) {
                    if (appointment && this.auth.canModifyAppointments()) {
                        this.showDeleteOption(dateStr);
                    } else if (this.auth.canModifyAppointments()) {
                        this.selectDate(day);
                    }
                }
            });
        } else {
            dayElement.addEventListener('click', (e) => {
                if (!this.isLongPress && this.auth.canModifyAppointments()) {
                    this.selectDate(day);
                }
            });
        }

        calendar.appendChild(dayElement);
    }

    setupDayTouchEvents(element, dateStr) {
        let longPressTimer;
        let isLongPress = false;

        element.addEventListener('touchstart', (e) => {
            if (!this.auth.canModifyAppointments()) return;
            
            isLongPress = false;
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                this.handleLongPress(dateStr);
                element.style.transform = 'scale(1)';
            }, this.longPressDelay);

            element.style.transform = 'scale(0.95)';
        });

        element.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
            element.style.transform = 'scale(1)';
        });

        element.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
            element.style.transform = 'scale(1)';
        });
    }

    handleLongPress(dateStr) {
        const appointment = this.appointments[dateStr];
        if (appointment && this.auth.canModifyAppointments()) {
            if (confirm('Termin löschen?')) {
                this.deleteAppointment(dateStr);
            }
        }
    }

    showDeleteOption(dateStr) {
        const modal = document.getElementById('appointmentModal');
        const modalContent = modal.querySelector('.modal-content');
        
        const existingDeleteSection = modalContent.querySelector('.delete-option');
        if (existingDeleteSection) {
            existingDeleteSection.remove();
        }

        const deleteSection = document.createElement('div');
        deleteSection.className = 'delete-option';
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Termin löschen';
        deleteButton.onclick = () => {
            if (confirm('Termin wirklich löschen?')) {
                this.deleteAppointment(dateStr);
                this.closeModal();
            }
        };
        
        deleteSection.appendChild(deleteButton);
        modalContent.appendChild(deleteSection);

        this.openModal();
    }

    async deleteAppointment(dateStr) {
        if (await this.api.deleteAppointment(dateStr)) {
            delete this.appointments[dateStr];
            const nextDateStr = this.getNextDay(dateStr);
            delete this.appointments[nextDateStr];
            this.renderCalendar();
        }
    }

    setupSwipeHandler() {
        const calendar = document.querySelector('.calendar-container');
        
        calendar.addEventListener('touchstart', e => {
            this.touchstartX = e.changedTouches[0].screenX;
            this.touchstartY = e.changedTouches[0].screenY;
        });

        calendar.addEventListener('touchend', e => {
            this.touchendX = e.changedTouches[0].screenX;
            this.touchendY = e.changedTouches[0].screenY;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diffX = this.touchendX - this.touchstartX;
        const diffY = this.touchendY - this.touchstartY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                this.previousMonth();
            } else {
                this.nextMonth();
            }
        }
    }

    previousMonth() {
        this.currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() - 1
        );
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1
        );
        this.renderCalendar();
    }

    selectDate(day) {
        const dateStr = this.formatDateString(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            day
        );
        this.selectedDate = dateStr;

        const displayDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            day
        ).toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });

        document.getElementById('selectedDate').textContent = displayDate;
        this.openModal();
    }

    openModal() {
        const modal = document.getElementById('appointmentModal');
        modal.style.display = 'flex';
        modal.classList.add('modal-open');
    }

    closeModal() {
        const modal = document.getElementById('appointmentModal');
        modal.classList.remove('modal-open');
        modal.style.display = 'none';
    }

    async saveAppointment(type, time) {
        if (!this.selectedDate) return;

        const appointment = await this.api.saveAppointment(this.selectedDate, type, time);
        if (appointment) {
            this.appointments = await this.api.fetchAppointments();
            this.renderCalendar();
            this.closeModal();
        }
    }

    attachEventListeners() {
        document.getElementById('prevMonth')?.addEventListener('click', () => this.previousMonth());
        document.getElementById('nextMonth')?.addEventListener('click', () => this.nextMonth());

        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());

        const modal = document.getElementById('appointmentModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                const type = slot.dataset.type;
                const time = slot.querySelector('.time').textContent;
                this.saveAppointment(type, time);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'ArrowLeft':
                        this.previousMonth();
                        break;
                    case 'ArrowRight':
                        this.nextMonth();
                        break;
                }
            }
        });
    }
}
// test
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar();
});