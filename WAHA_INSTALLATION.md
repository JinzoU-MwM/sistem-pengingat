# WAHA Core Installation Guide

WAHA (WhatsApp HTTP API) provides REST API for WhatsApp. Here are different installation methods:

## 🐳 Method 1: Docker (Recommended)

### Prerequisites
- Docker installed and running
- Docker Compose installed

### Quick Start
```bash
# 1. Clone or navigate to your project directory
cd /workspaces/sistem-pengingat

# 2. Start WAHA Core
./start-waha.sh

# 3. Open http://localhost:3000 in your browser
# 4. Scan QR code with WhatsApp
```

### Manual Docker Commands
```bash
# Pull the image
docker pull devlikeapro/waha

# Run the container
docker run -d \
  --name waha-whatsapp \
  -p 3000:3000 \
  -v $(pwd)/wha-sessions:/app/sessions \
  -v $(pwd)/wha-storage:/app/storage \
  -e WAHA_API_ENABLED=true \
  -e WHATSAPP_DEFAULT_ENGINE=NOWEB \
  -e WHATSAPP_START_ENGINE=true \
  devlikeapro/waha
```

### Docker Compose (Already Configured)
```bash
# Start the service
docker-compose up -d waha

# View logs
docker-compose logs -f waha

# Stop the service
docker-compose down waha
```

## 📦 Method 2: NPM (Node.js)

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation
```bash
# Create a new directory for WAHA
mkdir waha-core
cd waha-core

# Install WAHA
npm install @waha/core@latest

# Create start script
echo 'const waha = require("@waha/core");
waha.start();' > index.js

# Start WAHA
npm start
```

### Configuration (config.json)
```json
{
  "api": {
    "enabled": true,
    "prefix": "/api"
  },
  "whatsapp": {
    "defaultEngine": "NOWEB",
    "startEngine": true
  },
  "sessions": {
    "path": "./sessions",
    "save": true
  },
  "storage": {
    "media": true,
    "path": "./storage/media"
  }
}
```

## 🚀 Method 3: Railway Deployment

### Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Choose template: "WAHA Core" or use custom template
4. Configure environment variables:
   ```
   WAHA_API_ENABLED=true
   WHATSAPP_DEFAULT_ENGINE=NOWEB
   WHATSAPP_START_ENGINE=true
   ```
5. Deploy and get your Railway URL

## 🔧 Method 4: VPS/Cloud Server

### Ubuntu/Debian Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone your project
git clone <your-repo>
cd <your-repo>

# Start WAHA
./start-waha.sh
```

## 🌐 Method 5: Cloud Services

### Heroku
```bash
# Create Heroku app
heroku create your-waha-app

# Set environment variables
heroku config:set WAHA_API_ENABLED=true
heroku config:set WHATSAPP_DEFAULT_ENGINE=NOWEB
heroku config:set WHATSAPP_START_ENGINE=true

# Deploy
git push heroku main
```

### Render.com
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

## 📱 After Installation

### 1. Verify Installation
```bash
# Check if WAHA is running
curl http://localhost:3000/api/health

# Expected response:
{"success": true, "message": "OK"}
```

### 2. Connect WhatsApp
1. Open http://localhost:3000 in your browser
2. You'll see a QR code
3. Open WhatsApp on your phone
4. Go to Settings → Linked Devices
5. Scan the QR code
6. Wait for connection to establish

### 3. Test API
```bash
# Check connected sessions
curl http://localhost:3000/api/sessions

# Send a test message (replace with actual number)
curl -X POST http://localhost:3000/api/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "628123456789@c.us",
    "message": "Hello from WAHA API!"
  }'
```

## 🔗 Integration with Daily Task Reminder

### Update Environment
```bash
# Update your .env file
WAHA_API_URL=http://localhost:3000
```

### Test Integration
1. Create a task in your Daily Task Reminder
2. Add your WhatsApp number (format: 628123456789)
3. Wait for the reminder time
4. You should receive WhatsApp notification

## 🐛 Troubleshooting

### Common Issues

#### 1. Docker not running
```bash
# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

#### 2. Port already in use
```bash
# Check what's using port 3000
netstat -tulpn | grep :3000

# Kill the process or change port
docker-compose down waha
# Edit docker-compose.yml to use different port
docker-compose up -d waha
```

#### 3. WhatsApp connection issues
- Make sure you have good internet connection
- Try rescanning QR code
- Check WAHA logs: `docker-compose logs -f waha`
- Restart container: `docker-compose restart waha`

#### 4. API not responding
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs waha

# Restart container
docker-compose restart waha
```

### Health Check
```bash
# Check if WAHA API is healthy
curl http://localhost:3000/api/health

# Check sessions
curl http://localhost:3000/api/sessions
```

## 📚 Useful Endpoints

- **Health**: `GET /api/health`
- **Sessions**: `GET /api/sessions`
- **Send Message**: `POST /api/sendMessage`
- **Get Chats**: `GET /api/chats`
- **Get Messages**: `GET /api/messages`

## 🔒 Security Considerations

1. **API Key**: Set `WAHA_API_KEY` environment variable
2. **HTTPS**: Use reverse proxy (nginx/caddy) for production
3. **Firewall**: Restrict access to port 3000
4. **Network**: Use private networks when possible

## 📞 Support

- [WAHA Documentation](https://waha.devlike.pro/)
- [GitHub Issues](https://github.com/devlikeapro/waha/issues)
- [Discord Community](https://discord.gg/invite/waha)

---

**Choose the method that best fits your environment. Docker is recommended for most use cases.**