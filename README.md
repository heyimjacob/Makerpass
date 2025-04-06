# Makerpass

A dynamic bio generator that evolves with your online presence. Automatically create and maintain your professional bio based on your online content and activities.

![Makerpass](https://via.placeholder.com/800x400?text=Makerpass)

## Features

- 🔍 **Content Scraping**: Automatically extract content from your online profiles and websites
- ✍️ **AI-Powered Bio Generation**: Leverage OpenAI to craft professional bios from your content
- 🌐 **Easy Web Display**: Clean interface to display your bio and links
- 💻 **Command-line Interface**: Simple CLI for managing your content and bio
- 🔄 **Automatic Updates**: Keep your bio fresh with the latest content

## Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- OpenAI API key (for bio generation)
- Firecrawl API key (for production content scraping)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/heyimjacob/makerpass.git
   cd Makerpass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Visit `http://localhost:3000` in your browser

## Usage

### Adding Links

```bash
node cli.js add-link --url https://yourwebsite.com --commentary "Your role or context for this link"
```

### Generating Bio

```bash
node cli.js generate-bio
```

### Viewing Bio

```bash
node cli.js show-bio
```

## Deployment

See [Deployment Guide](docs/workflow.md) for detailed instructions on deploying to your own server.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Jacob Edgar-Anderson 