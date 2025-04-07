# Directory Structure Explained

This document provides a comprehensive overview of the project's directory structure, explaining the purpose of each folder and key files. Understanding this structure is essential for navigating and modifying the codebase.

## Project Overview

```
ItWasJacob.com/              # Root project directory
├── app/                     # Dynamic Bio application
│   ├── api/                 # API endpoints
│   ├── components/          # UI component files
│   ├── docs/                # Application-specific documentation
│   ├── lib/                 # Core functionality modules
│   │   ├── scrapers/        # Content scraping modules
│   │   └── storage/         # Data storage modules
│   ├── public/              # Static assets (CSS, images)
│   │   └── styles/          # CSS stylesheets
│   ├── views/               # EJS templates for pages
│   ├── cli.js               # Command-line interface
│   ├── docker-compose.yml   # Docker configuration
│   ├── Dockerfile           # Container definition
│   ├── index.js             # Main application file
│   └── package.json         # Dependencies and scripts
├── config/                  # Infrastructure configuration
│   └── nginx/               # Nginx server configuration
├── docker/                  # Docker infrastructure files
│   └── config/              # Service configurations
├── docs/                    # Project-level documentation
│   ├── intro.md             # Project introduction
│   ├── architecture.md      # System architecture overview
│   ├── deployment.md        # Deployment instructions
│   ├── directory-structure.md # This file
│   └── todo.md              # Future enhancements
├── log/                     # Project logs and updates
│   ├── decisions/           # Architecture decision records
│   └── updates/             # Implementation updates
└── scripts/                 # Infrastructure scripts
    ├── deploy-services.sh   # Service deployment script
    ├── renew-ssl.sh         # SSL certificate renewal
    └── server-setup.sh      # Initial server setup
```

## Key Directories Explained

### `/app`

Contains the Dynamic Bio application - the core functionality that handles content scraping, bio generation, and web display.

#### Notable Files and Subdirectories:

- **`/app/lib`**: Core functionality modules
  - **`/app/lib/bioGenerator.js`**: Handles OpenAI integration and bio creation
  - **`/app/lib/scrapers/firecrawlScraper.js`**: Manages content extraction
  - **`/app/lib/storage/linksStorage.js`**: Handles data persistence

- **`/app/cli.js`**: Command-line interface for managing links and generating bios
- **`/app/index.js`**: Web server that displays the bio and links
- **`/app/views/index.ejs`**: HTML template for the website
- **`/app/public/styles/main.css`**: Stylesheet for the website

### `/config`

Contains configuration files for the infrastructure services.

### `/docker`

Contains Docker-related files for containerization of the services.

### `/docs`

Contains high-level project documentation aimed at users and developers.

### `/log`

Contains records of architectural decisions and implementation updates.

### `/scripts`

Contains utility scripts for server setup and maintenance.

## Data Flow Through Directories

When you add a link to your bio:

1. The command is processed by `/app/cli.js`
2. Content is scraped using `/app/lib/scrapers/firecrawlScraper.js`
3. The content is stored via `/app/lib/storage/linksStorage.js`
4. A new bio is generated using `/app/lib/bioGenerator.js`
5. The web server in `/app/index.js` serves the updated content
6. The template in `/app/views/index.ejs` displays the content with styling from `/app/public/styles/main.css`

## For Marketers: How to Navigate This Structure

When working with this codebase, these are the files you'll most commonly interact with:

1. **Adding a feature to the website**: 
   - Edit `/app/views/index.ejs` for HTML structure
   - Edit `/app/public/styles/main.css` for styling

2. **Changing how the bio is generated**:
   - Modify `/app/lib/bioGenerator.js`

3. **Adjusting what content is scraped**:
   - Modify `/app/lib/scrapers/firecrawlScraper.js`

4. **Adding CLI commands**:
   - Edit `/app/cli.js`

5. **Deployment settings**:
   - Edit `/app/docker-compose.yml` for container configuration

Understanding this structure helps you locate the right files to modify when implementing features or fixing issues. The separation of concerns (each directory has a specific purpose) is a software design principle that keeps the codebase organized and maintainable. 