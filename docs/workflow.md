# Development Workflow

This document outlines the recommended development workflow for the Makerpass application.

## Overview

We use a GitHub-based workflow with automatic deployments to our VPS. This allows for a smooth development experience without having to manually deploy or rebuild containers.

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/heyimjacob/makerpass.git
   cd makerpass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a local `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. Start the application locally:
   ```bash
   npm start
   ```

## Making Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the codebase

3. Test your changes locally:
   ```bash
   npm test  # if tests are available
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. Push your changes to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request on GitHub to merge your changes into the main branch

7. After the PR is approved and merged, GitHub Actions will automatically deploy the changes to the production server

## Deployment Process

The deployment process is handled automatically by GitHub Actions:

1. When changes are pushed to the `main` branch, GitHub Actions is triggered
2. The workflow creates an `.env` file with secrets from GitHub
3. The code is copied to the production server
4. Docker Compose rebuilds and restarts the application

## Adding Links and Generating Bios

You can add links and generate bios using the CLI:

```bash
# SSH into the server
ssh root@195.201.30.134

# Navigate to the application directory
cd /opt/itwasjacob/Makerpass

# Add a link
docker compose exec makerpass-website node cli.js add-link --url https://example.com --commentary "Description of this link"

# Generate a bio
docker compose exec makerpass-website node cli.js generate-bio
```

## Checking Logs

To check the application logs:

```bash
ssh root@195.201.30.134
cd /opt/itwasjacob/Makerpass
docker compose logs
```

## Troubleshooting

If the application is not working as expected:

1. Check the application logs:
   ```bash
   docker compose logs
   ```

2. Check if Nginx is properly configured:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. Make sure the data directory has appropriate permissions:
   ```bash
   sudo chown -R 1000:1000 /opt/itwasjacob/Makerpass/data
   ``` 