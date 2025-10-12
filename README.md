# Daily Task Reminder

A modern task reminder system built with Node.js, Express, SQLite, and WhatsApp API integration.

## 🚀 Features

- ✅ **Task Management** - Create, read, update, and delete tasks
- 📱 **WhatsApp Notifications** - Automatic reminders via WhatsApp
- 🎯 **Priority System** - High/Medium/Low priority with visual indicators
- ⏰ **Cron Scheduler** - Checks for due tasks every minute
- 📱 **Responsive Design** - Works on mobile and desktop
- 💾 **Data Persistence** - SQLite database stores all tasks
- 🔄 **Real-time Updates** - Auto-refresh tasks every 30 seconds

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite
- **Scheduler**: node-cron
- **Notifications**: WAHA API (WhatsApp)
- **Frontend**: HTML + CSS + Vanilla JavaScript
- **Deployment**: Railway.app

## 📋 Quick Start

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd daily-task-reminder
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize database**
   ```bash
   npm run init-db
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:4000`

## 🚀 Railway Deployment

### Prerequisites
- Railway account
- GitHub repository with your code
- WAHA API instance (for WhatsApp notifications)

### Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect the Node.js project

3. **Configure Environment Variables**
   In your Railway project settings, add these environment variables:
   ```
   NODE_ENV=production
   WAHA_API_URL=https://your-waha-instance.com
   ```

4. **Deploy**
   Railway will automatically build and deploy your application. Your app will be available at a `.railway.app` URL.

### Railway Configuration Files

- `railway.json` - Railway deployment configuration
- `nixpacks.toml` - Build configuration for Railway
- `.env.example` - Environment variables template

## 📱 WhatsApp API Setup

The app uses WAHA API for WhatsApp notifications:

1. **Set up WAHA API**
   - Deploy WAHA API instance (Docker or cloud service)
   - Get your WAHA API URL

2. **Configure**
   - Set `WAHA_API_URL` in your environment variables
   - Example: `https://your-waha-instance.com`

3. **Format WhatsApp Numbers**
   - Use format: `628123456789` (Indonesia format)
   - No `+` or leading `0`

## 📊 API Endpoints

### Tasks API
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Mark task complete
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/health` - Health check

### Task Schema
```json
{
  "id": "integer",
  "title": "string (required)",
  "description": "string (optional)",
  "datetime": "string (ISO datetime, required)",
  "priority": "string (low|medium|high)",
  "whatsapp_number": "string (optional)",
  "completed": "boolean",
  "created_at": "string (ISO datetime)",
  "updated_at": "string (ISO datetime)"
}
```

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No (auto-set by Railway) |
| `NODE_ENV` | Environment | development | No |
| `WAHA_API_URL` | WhatsApp API URL | http://localhost:3000 | Yes (for notifications) |

## 📁 Project Structure

```
daily-task-reminder/
├── server.js             # Main Express server
├── db.js                 # SQLite database setup
├── routes/
│   └── tasks.js          # API routes
├── public/
│   ├── index.html        # Frontend HTML
│   ├── style.css         # CSS styles
│   └── script.js         # Frontend JavaScript
├── package.json          # Node dependencies
├── railway.json          # Railway config
├── nixpacks.toml         # Build config
├── .env.example          # Environment template
└── tasks.db              # SQLite database (auto-created)
```

## 🔄 How It Works

1. **Task Creation**: Users create tasks via web interface
2. **Storage**: Tasks stored in SQLite database
3. **Scheduled Checks**: Cron job checks for due tasks every minute
4. **Notifications**: WhatsApp notifications sent via WAHA API
5. **Real-time UI**: Frontend auto-refreshes every 30 seconds

## 🐛 Troubleshooting

### Common Issues

1. **Database not initializing**
   - Run `npm run init-db` manually
   - Check file permissions

2. **WhatsApp notifications not working**
   - Verify WAHA_API_URL is correct
   - Check WAHA API is running and accessible
   - Ensure phone number format is correct

3. **Deployment issues on Railway**
   - Check environment variables are set correctly
   - Verify build logs in Railway dashboard
   - Ensure all dependencies are in package.json

4. **Tasks not showing**
   - Check browser console for JavaScript errors
   - Verify API endpoints are accessible
   - Check network connectivity

### Debug Mode

Enable debug logging:
```bash
NODE_ENV=development npm start
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Railway deployment logs
3. Open an issue in the repository

---

**Built with ❤️ for productivity and task management**