#!/bin/bash

# Create directory structure
mkdir -p /opt/itwasjacob/{docker,config,scripts}

# Create docker-compose.yml
cat > /opt/itwasjacob/docker/docker-compose.yml << 'EOL'
version: '3.8'

services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx:/etc/nginx/conf.d
      - ./config/letsencrypt:/etc/letsencrypt
    networks:
      - itwasjacob-network
    restart: unless-stopped

networks:
  itwasjacob-network:
    driver: bridge
EOL

# Create Nginx configuration
mkdir -p /opt/itwasjacob/config/nginx
cat > /opt/itwasjacob/config/nginx/default.conf << 'EOL'
server {
    listen 80;
    server_name itwasjacob.com www.itwasjacob.com marcus.itwasjacob.com blog.itwasjacob.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name itwasjacob.com www.itwasjacob.com;

    ssl_certificate /etc/letsencrypt/live/itwasjacob.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/itwasjacob.com/privkey.pem;

    location / {
        proxy_pass http://core:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name marcus.itwasjacob.com;

    ssl_certificate /etc/letsencrypt/live/itwasjacob.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/itwasjacob.com/privkey.pem;

    location / {
        proxy_pass http://marcus:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name blog.itwasjacob.com;

    ssl_certificate /etc/letsencrypt/live/itwasjacob.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/itwasjacob.com/privkey.pem;

    location / {
        proxy_pass http://blog:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOL

# Start the services
cd /opt/itwasjacob/docker
docker compose up -d

echo "Services deployed! Next steps:"
echo "1. Deploy your individual services (core, marcus, blog)" 