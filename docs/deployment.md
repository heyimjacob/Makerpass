# Deployment Guide: GitHub to VPS Pipeline

This guide explains how to set up a streamlined deployment process for the Dynamic Bio application. The goal is to make deployments as simple as pushing code to GitHub.

## Deployment Architecture

```
┌──────────────┐     ┌───────────────┐     ┌─────────────┐     ┌─────────────┐
│              │     │               │     │             │     │             │
│  Your Local  │ --> │    GitHub     │ --> │   GitHub    │ --> │ VPS Server  │
│  Computer    │     │  Repository   │     │   Actions   │     │             │
│              │     │               │     │             │     │             │
└──────────────┘     └───────────────┘     └─────────────┘     └─────────────┘
```

This creates a continuous deployment pipeline where:
1. You make changes locally
2. You push to GitHub
3. GitHub Actions automatically deploys to your VPS
4. The website updates with your changes

## Setup Instructions

### 1. GitHub Repository Setup

1. Create a new GitHub repository:
   ```bash
   # Initialize git in your project
   git init
   
   # Add all files
   git add .
   
   # Commit the files
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub and push your code:
   ```bash
   # Add the remote repository
   git remote add origin https://github.com/yourusername/itwasjacob.git
   
   # Push to GitHub
   git push -u origin main
   ```

### 2. GitHub Secrets Configuration

In your GitHub repository settings, add these secrets:

1. `HOST` - Your server IP address (e.g., 195.201.30.134)
2. `USERNAME` - Your server username (typically "root")
3. `SSH_KEY` - Your private SSH key for accessing the server

To generate and use SSH keys:
```bash
# Generate a new SSH key for deployment
ssh-keygen -t ed25519 -C "deployment-key" -f ~/.ssh/deployment_key

# Copy the private key for GitHub secret
cat ~/.ssh/deployment_key

# Copy the public key to your server
ssh-copy-id -i ~/.ssh/deployment_key.pub root@195.201.30.134
```

### 3. GitHub Actions Workflow

Create a file `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: SSH and deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            # Navigate to application directory
            cd /opt/itwasjacob/dynamic-bio
            
            # Pull latest changes
            git pull
            
            # Update dependencies if needed
            cd app
            npm ci --only=production
            
            # Restart the application
            docker compose down
            docker compose up -d --build
```

### 4. VPS Initial Setup

SSH into your server and set up the application directory:

```bash
# Create application directory
mkdir -p /opt/itwasjacob/dynamic-bio

# Clone the repository
git clone https://github.com/yourusername/itwasjacob.git /opt/itwasjacob/dynamic-bio

# Create environment file
cd /opt/itwasjacob/dynamic-bio/app
cp .env.example .env
nano .env  # Edit with your API keys

# Start the application
docker compose up -d
```

### 5. Nginx Configuration

Create or modify your Nginx configuration:

```bash
# Edit Nginx configuration
nano /opt/itwasjacob/docker/config/nginx/default.conf
```

Add this server block:

```nginx
server {
    listen 80;
    server_name itwasjacob.com www.itwasjacob.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name itwasjacob.com www.itwasjacob.com;

    ssl_certificate /etc/letsencrypt/live/itwasjacob.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/itwasjacob.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Reload Nginx:
```bash
docker compose exec nginx nginx -s reload
```

## Usage

### Making Changes

Once set up, deploying changes is as simple as:

```bash
# Make your changes
git add .
git commit -m "Update website design"
git push
```

GitHub Actions will automatically deploy your changes to the server.

### Adding Links

To add a new link to your bio:

```bash
# SSH into your server
ssh root@195.201.30.134

# Run the link command
cd /opt/itwasjacob/dynamic-bio/app
docker compose exec dynamic-bio-website npm run add-link -- --url https://example.com --regenerate
```

## Deployment Management

### Viewing Logs

```bash
# View container logs
cd /opt/itwasjacob/dynamic-bio/app
docker compose logs

# Follow logs in real-time
docker compose logs -f
```

### Rollbacks

If a deployment causes issues:

```bash
# SSH into your server
ssh root@195.201.30.134

# Go to the application directory
cd /opt/itwasjacob/dynamic-bio

# Check out the previous commit
git reset --hard HEAD~1

# Restart the application
cd app
docker compose down
docker compose up -d
```

## Explanation for Marketers

This deployment process follows a modern "Infrastructure as Code" approach:

1. **Version Control (Git/GitHub)**: Tracks all changes to your code
2. **Continuous Integration/Deployment (GitHub Actions)**: Automates testing and deployment
3. **Containerization (Docker)**: Ensures your app runs consistently in any environment

These concepts are becoming increasingly relevant for marketing technology stacks, where deployment speed and reliability are critical for campaign launches and website updates.

What makes this approach powerful is that it brings software development best practices to marketing operations, allowing for:

1. **Fast iterations**: Launch changes in minutes rather than days
2. **Change tracking**: Know exactly what changed and when
3. **Easy rollbacks**: Quickly revert to a previous version if needed

This integration of marketing and development workflows represents the modern approach to digital experience management. 