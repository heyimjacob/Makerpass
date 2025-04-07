# Makerpass

![Deployment Status](https://github.com/heyimjacob/Makerpass/actions/workflows/makerpass-deploy.yml/badge.svg)

Makerpass is a dynamic bio generator that creates professional bios based on your online presence. It scrapes content from your links, processes the information using AI, and generates a cohesive bio that reflects your professional identity.

## Features

- Link management: Add, update, and remove links to content that represents you
- Content scraping: Automatically extract relevant information from your links
- Bio generation: Use AI to create professional bios from your aggregated content
- Web interface: View and manage your bio and links through a clean web UI
- CLI: Manage your links and bio through command-line interface

## Tech Stack

- Node.js & Express
- OpenAI API for bio generation
- Firecrawl API for content scraping
- EJS for templating
- Docker for containerization

## Getting Started

### Prerequisites

- Node.js v18+
- Docker and Docker Compose
- API keys for OpenAI and Firecrawl

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/heyimjacob/makerport.git
   cd makerport
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an environment file `.env` with the following variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   OPENAI_API_KEY=your_openai_api_key
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   DEFAULT_BIO_TONE=professional
   DEFAULT_BIO_MAX_LENGTH=150
   DEFAULT_BIO_NAME=Your Name
   PORT=3000
   ```

### Running Locally

```bash
npm start
```

Or with Docker:

```bash
docker compose up -d
```

Then visit `http://localhost:3000` to access the application.

### CLI Usage

The CLI provides commands to manage your links and generate bios:

```bash
# Add a link
node cli.js add-link --url https://example.com --commentary "This is my personal website"

# List all links
node cli.js list-links

# Generate a bio
node cli.js generate-bio

# Help
node cli.js --help
```

## Deployment

See the [deployment guide](docs/deployment.md) for detailed instructions on deploying Makerpass to a production server.

## License

MIT

## Author

Created by Jacob Edgar-Anderson 