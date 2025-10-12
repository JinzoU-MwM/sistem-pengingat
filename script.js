class ReminderSystem {
    constructor() {
        this.reminders = this.loadReminders();
        this.currentFilter = 'all';
        this.notificationPermission = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.requestNotificationPermission();
        this.checkDueReminders();
        this.renderReminders();

        // Check for due reminders every minute
        setInterval(() => this.checkDueReminders(), 60000);
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('reminderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addReminder();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Set minimum datetime to current time
        const datetimeInput = document.getElementById('datetime');
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        datetimeInput.min = now.toISOString().slice(0, 16);
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission === 'granted';
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addReminder() {
        const form = document.getElementById('reminderForm');
        const formData = new FormData(form);

        const reminder = {
            id: this.generateId(),
            title: formData.get('title'),
            description: formData.get('description'),
            datetime: formData.get('datetime'),
            priority: formData.get('priority'),
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.reminders.push(reminder);
        this.saveReminders();
        this.renderReminders();
        form.reset();

        this.showNotification('Pengingat berhasil ditambahkan!', 'success');

        // Set minimum datetime again
        const datetimeInput = document.getElementById('datetime');
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        datetimeInput.min = now.toISOString().slice(0, 16);
    }

    deleteReminder(id) {
        this.reminders = this.reminders.filter(r => r.id !== id);
        this.saveReminders();
        this.renderReminders();
        this.showNotification('Pengingat dihapus', 'info');
    }

    completeReminder(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            reminder.completed = true;
            this.saveReminders();
            this.renderReminders();
            this.showNotification('Pengingat ditandai selesai', 'success');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.renderReminders();
    }

    getFilteredReminders() {
        switch (this.currentFilter) {
            case 'active':
                return this.reminders.filter(r => !r.completed);
            case 'completed':
                return this.reminders.filter(r => r.completed);
            default:
                return this.reminders;
        }
    }

    checkDueReminders() {
        const now = new Date();
        const dueReminders = this.reminders.filter(reminder => {
            if (reminder.completed) return false;
            const reminderTime = new Date(reminder.datetime);
            const timeDiff = reminderTime - now;
            return timeDiff > 0 && timeDiff <= 60000; // Due within 1 minute
        });

        dueReminders.forEach(reminder => {
            this.triggerNotification(reminder);
        });
    }

    triggerNotification(reminder) {
        const title = `Pengingat: ${reminder.title}`;
        const options = {
            body: reminder.description || `Waktunya untuk: ${reminder.title}`,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',
            tag: reminder.id,
            requireInteraction: true
        };

        if (this.notificationPermission) {
            new Notification(title, options);
        } else {
            this.showNotification(title, 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    formatDateTime(datetime) {
        const date = new Date(datetime);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('id-ID', options);
    }

    isOverdue(datetime) {
        return new Date(datetime) < new Date();
    }

    renderReminders() {
        const container = document.getElementById('remindersContainer');
        const filteredReminders = this.getFilteredReminders();

        if (filteredReminders.length === 0) {
            container.innerHTML = '<p class="empty-state">Tidak ada pengingat untuk ditampilkan.</p>';
            return;
        }

        // Sort by datetime, overdue first
        filteredReminders.sort((a, b) => {
            const dateA = new Date(a.datetime);
            const dateB = new Date(b.datetime);
            return dateA - dateB;
        });

        container.innerHTML = filteredReminders.map(reminder => {
            const isOverdue = this.isOverdue(reminder.datetime);
            const priorityClass = `priority-${reminder.priority}`;
            const statusClasses = [
                reminder.completed ? 'completed' : '',
                isOverdue && !reminder.completed ? 'overdue' : '',
                reminder.priority === 'high' && !reminder.completed ? 'high-priority' : ''
            ].filter(Boolean).join(' ');

            return `
                <div class="reminder-item ${statusClasses}">
                    <div class="reminder-header">
                        <div class="reminder-title">${this.escapeHtml(reminder.title)}</div>
                        <div class="reminder-actions">
                            ${!reminder.completed ? `
                                <button class="complete-btn" onclick="reminderSystem.completeReminder('${reminder.id}')">
                                    Selesai
                                </button>
                            ` : ''}
                            <button class="delete-btn" onclick="reminderSystem.deleteReminder('${reminder.id}')">
                                Hapus
                            </button>
                        </div>
                    </div>
                    ${reminder.description ? `
                        <div class="reminder-description">${this.escapeHtml(reminder.description)}</div>
                    ` : ''}
                    <div class="reminder-datetime">
                        📅 ${this.formatDateTime(reminder.datetime)}
                        ${isOverdue && !reminder.completed ? ' <span style="color: #dc3545;">(Terlambat)</span>' : ''}
                    </div>
                    <div class="reminder-priority ${priorityClass}">
                        Prioritas: ${this.getPriorityLabel(reminder.priority)}
                    </div>
                </div>
            `;
        }).join('');
    }

    getPriorityLabel(priority) {
        const labels = {
            'low': 'Rendah',
            'medium': 'Sedang',
            'high': 'Tinggi'
        };
        return labels[priority] || priority;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveReminders() {
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
    }

    loadReminders() {
        const saved = localStorage.getItem('reminders');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the reminder system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reminderSystem = new ReminderSystem();
});

// Handle page visibility change to check reminders when page becomes active
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.reminderSystem) {
        window.reminderSystem.checkDueReminders();
    }
});