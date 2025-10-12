require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');
const tasksRouter = require('./routes/tasks');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/tasks', tasksRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Fallback route for SPA (serve index.html for all non-API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WhatsApp notification helper
const sendWhatsAppNotification = async (task) => {
    try {
        if (!task.whatsapp_number) {
            console.log(`Task "${task.title}" has no WhatsApp number, skipping notification`);
            return;
        }

        const WAHA_API_URL = process.env.WAHA_API_URL || 'http://localhost:3000';
        const message = `🔔 *Pengingat Tugas*\n\n📝 *${task.title}*\n${task.description ? `${task.description}\n` : ''}⏰ Waktu: ${new Date(task.datetime).toLocaleString('id-ID')}\n🎯 Prioritas: ${task.priority.toUpperCase()}`;

        const response = await axios.post(`${WAHA_API_URL}/api/sendMessage`, {
            chatId: `${task.whatsapp_number}@c.us`,
            message: message
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`WhatsApp notification sent for task "${task.title}":`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Failed to send WhatsApp notification for task "${task.title}":`, error.message);
        return null;
    }
};

// Cron job to check due reminders every minute
cron.schedule('* * * * *', async () => {
    console.log('Checking for due reminders...');

    try {
        const currentDateTime = new Date().toISOString();
        const oneMinuteLater = new Date(Date.now() + 60000).toISOString();

        const { dbOperations } = require('./db');
        const query = `
            SELECT * FROM tasks
            WHERE completed = 0
            AND datetime >= ?
            AND datetime <= ?
            ORDER BY datetime ASC
        `;

        const dueTasks = await dbOperations.all(query, [currentDateTime, oneMinuteLater]);

        if (dueTasks.length > 0) {
            console.log(`Found ${dueTasks.length} due task(s):`);

            for (const task of dueTasks) {
                console.log(`- Processing reminder for: "${task.title}"`);

                // Send WhatsApp notification
                await sendWhatsAppNotification(task);

                // Optional: Mark as notified to avoid duplicate notifications
                // You could add a 'notified' column to the database
            }
        } else {
            console.log('No due tasks found.');
        }
    } catch (error) {
        console.error('Error checking due reminders:', error);
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        // Initialize database tables
        initDatabase();
        console.log('Database initialized successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📱 Reminder system active - checking every minute`);
            console.log(`📊 API available at http://localhost:${PORT}/api`);

            if (process.env.NODE_ENV !== 'production') {
                console.log(`\n📋 Available endpoints:`);
                console.log(`  GET    /api/tasks           - Get all tasks`);
                console.log(`  POST   /api/tasks           - Create new task`);
                console.log(`  GET    /api/tasks/:id       - Get single task`);
                console.log(`  PUT    /api/tasks/:id       - Update task`);
                console.log(`  PATCH  /api/tasks/:id/complete - Mark task complete`);
                console.log(`  DELETE /api/tasks/:id       - Delete task`);
                console.log(`  GET    /api/health          - Health check`);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🔄 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;