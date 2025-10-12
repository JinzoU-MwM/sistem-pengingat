#!/bin/bash

# WAHA Core Startup Script
echo "🚀 Starting WAHA Core for WhatsApp API..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories (optional - Docker will create them)
mkdir -p ./waha-data/sessions
mkdir -p ./waha-data/storage

echo "📦 Pulling WAHA Core Docker image..."
docker-compose pull waha

echo "🔧 Starting WAHA Core container..."
docker-compose up -d waha

echo "⏳ Waiting for WAHA Core to start..."
sleep 10

# Check if container is running
if docker-compose ps waha | grep -q "Up"; then
    echo "✅ WAHA Core is running successfully!"
    echo ""
    echo "📱 WAHA Core Information:"
    echo "   🌐 Web Interface: http://localhost:3000"
    echo "   🔗 API Base URL: http://localhost:3000/api"
    echo "   📊 Health Check: http://localhost:3000/api/health"
    echo ""
    echo "🔧 Next Steps:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Scan the QR code with WhatsApp"
    echo "   3. Your Daily Task Reminder can now send WhatsApp notifications"
    echo ""
    echo "🐛 To view logs: docker-compose logs -f waha"
    echo "🛑 To stop: docker-compose down waha"
else
    echo "❌ Failed to start WAHA Core. Check the logs:"
    echo "   docker-compose logs waha"
    exit 1
fi