#!/bin/bash

# Create necessary directories
mkdir -p config/nginx
mkdir -p config/ssl
mkdir -p config/letsencrypt

# Copy configuration files
cp docker/docker-compose.yml .
cp config/nginx/default.conf config/nginx/

# Set up environment variables
if [ ! -f .env ]; then
    echo "VPS_IP=your_vps_ip" > .env
    echo "DOMAIN=itwasjacob.com" >> .env
    echo "EMAIL=your-email@example.com" >> .env
    echo "Please edit .env with your actual values"
fi

# Make scripts executable
chmod +x scripts/*.sh

echo "Setup complete. Please:"
echo "1. Edit .env with your actual values"
echo "2. Run 'docker-compose up -d' to start the services" 