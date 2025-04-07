# Deployment Guide: Makerport

This guide outlines the deployment process for the Makerport application, a dynamic bio generator that evolves with your content.

## Architecture Overview

The application consists of:
- Node.js backend
- Express web server
- Docker containerization
- Nginx reverse proxy
- GitHub Actions for automated deployment

## Prerequisites

1. A VPS (Virtual Private Server) running Ubuntu 24.04
2. Domain name (optional, but recommended)
3. GitHub account
4. API keys for:
   - OpenAI
   - Firecrawl

## Server Setup

### 1. Initial Server Configuration

```bash
# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y git docker.io docker-compose nginx
```

### 2. Docker Setup

```bash
# Install Docker using the official script
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 3. Nginx Configuration

Create `/etc/nginx/sites-available/makerport`:
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/makerport /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Application Deployment

### 1. GitHub Repository Setup

1. Create a new repository on GitHub
2. Add the following secrets:
   - `VPS_HOST`: Your server's IP address
   - `VPS_USERNAME`: SSH username (usually 'root')
   - `VPS_SSH_KEY`: Private SSH key for server access

### 2. Initial Deployment

```bash
# Clone the repository
mkdir -p /opt/makerport
cd /opt/makerport
git clone https://github.com/yourusername/makerport.git .

# Create .env file
cat > .env << EOL
# Environment Variables
PORT=3000

# API Keys
FIRECRAWL_API_KEY=your_firecrawl_key
OPENAI_API_KEY=your_openai_key

# Bio Generation Options
DEFAULT_BIO_TONE=professional
DEFAULT_BIO_MAX_LENGTH=500
DEFAULT_BIO_NAME="Your Name"
EOL

# Start the application
docker compose up -d
```

### 3. Automated Deployments

The application uses GitHub Actions for automated deployments. Any push to the `main` branch will trigger:
1. Code checkout
2. SSH deployment to the server
3. Docker container rebuild and restart

## Maintenance

### Updating Environment Variables

To update environment variables:
1. SSH into the server
2. Edit `/opt/makerport/.env`
3. Restart the application:
   ```bash
   cd /opt/makerport
   docker compose down
   docker compose up -d
   ```

### Viewing Logs

```bash
# View application logs
docker compose logs -f

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Common Issues

1. **Port 80 Already in Use**
   ```bash
   # Check what's using port 80
   lsof -i :80
   
   # Stop the conflicting service
   docker stop container_name
   ```

2. **Docker Container Won't Start**
   ```bash
   # Check container logs
   docker compose logs
   
   # Rebuild and restart
   docker compose down
   docker compose up -d --build
   ```

3. **Nginx Configuration Issues**
   ```bash
   # Test configuration
   nginx -t
   
   # Restart Nginx
   systemctl restart nginx
   ```

## Security Considerations

1. Keep your API keys secure
2. Regularly update system packages
3. Use HTTPS (recommended)
4. Monitor application logs
5. Keep Docker and Nginx updated

## Backup and Recovery

### Backup
```bash
# Backup application data
cd /opt/makerport
tar -czf makerport_backup.tar.gz data/
```

### Recovery
```bash
# Restore from backup
cd /opt/makerport
tar -xzf makerport_backup.tar.gz
docker compose up -d
``` 